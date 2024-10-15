import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class CryptoUtils {
    // bcrypt functions
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // base64 functions
    static base64Encode(str: string): string {
        return Buffer.from(str).toString('base64');
    }

    static base64Decode(base64Str: string): string {
        return Buffer.from(base64Str, 'base64').toString('utf-8');
    }

    // SHA-256 function
    static sha256Hash(str: string): string {
        return crypto.createHash('sha256').update(str).digest('hex');
    }
}