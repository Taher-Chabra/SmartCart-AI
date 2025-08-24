import crypto from 'crypto';
import redis from '../config/redis';

const hashOTP = (otp: string) => {
  const secret = process.env.OTP_SECRET_KEY as string;
  return crypto.createHmac('sha256', secret).update(otp).digest('hex');
}

const generateOTPAndHash = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashed = hashOTP(otp);
  return { otp, hashed };
}

const canGenerate = async (email: string) => {
  const genKey = `verify:gen:${email}`;
  let attempts = Number(await redis.get(genKey)) || 0;

  if (attempts >= 3) {
    return {
      success: false,
      reason: 'Too many attempts',
    };
  }

  if (attempts === 0) {
    await redis.setex(genKey, 300, 1);
  } else {
    await redis.incr(genKey);
  }

  const cooldown = await redis.get(`verify:cooldown:${email}`);
  if (cooldown) {
    return {
      success: false,
      reason: 'Not allowed',
    };
  }

  await redis.setex(`verify:cooldown:${email}`, 120, 1);
  return { success: true, reason: '' };
};

const generateOTPAndSave = async (email: string) => {
  const { otp, hashed } = generateOTPAndHash();
  const canGenerateResult = await canGenerate(email);
  if (!canGenerateResult.success) {
    return { ...canGenerateResult, token: null };
  }

  await redis.setex(`verify:${email}`, 300, hashed);
  return { ...canGenerateResult, token: otp };
};

const verifyOTP = async (email: string, userInput: string) => {
  const attemptsKey = `verify:attempts:${email}`;
  const attempts = Number(await redis.get(attemptsKey)) || 0;

  if (attempts >= 5) {
    return { success: false, reason: 'Too many attempts' };
  }

  const hashedToken = await redis.get(`verify:${email}`);
  if (!hashedToken) {
    return { success: false, reason: 'Invalid or expired code' };
  }

  const userInputHashed = hashOTP(userInput);

  if (userInputHashed === hashedToken) {
    await redis.del(
      `verify:${email}`,
      `verify:attempts:${email}`,
      `verify:gen:${email}`,
      `verify:cooldown:${email}`
    );
    return { success: true, reason: '' };
  }

  const ttl = await redis.ttl(`verify:${email}`);
  if (ttl > 0) {
    await redis.multi()
      .incr(attemptsKey)
      .expire(attemptsKey, 300)
      .exec();
  }
  return { success: false, reason: 'Invalid or expired code' };
};

export { generateOTPAndSave, verifyOTP };
