import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvService } from './env/env.services'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule
  ],

  providers: [EnvService]
})
export class AppModule {}
