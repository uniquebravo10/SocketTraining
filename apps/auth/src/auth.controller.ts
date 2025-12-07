import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  getNounce(@Query('address') address:string){
    return this.authService.sendNounce(address);
  }

  @Post('verify')
  verify(@Body() body:{message:string, signature:string}){
    return this.authService.verify(body);
  }
  
}
