import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { SiweMessage } from 'siwe';

const nonces = new Map<string, string>();
@Injectable()
export class AuthService {



  sendNounce(address: string) {
    const nonce = randomBytes(16).toString('hex');
    nonces.set(address.toLowerCase(), nonce);

    return { nonce };
  }

  async verify(body: { message: string; signature: string }){
    try {
      const siweMessage = new SiweMessage(body.message);
      
      const result = await siweMessage.verify({ 
        signature: body.signature 
      });

      if (!result.success) {
        return { success: false, error: 'Invalid signature' };
      }

      const storedNonce = nonces.get(siweMessage.address.toLowerCase());
      if (storedNonce !== siweMessage.nonce) {
        return { success: false, error: 'Invalid nonce' };
      }

      nonces.delete(siweMessage.address.toLowerCase());

      return {
        success: true,
        address: siweMessage.address,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
