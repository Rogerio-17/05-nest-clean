import { Module } from "@nestjs/common";
import { EnvService } from "./env.services";

@Module({
    providers: [
        EnvService
    ], 

    exports: [EnvService]
})

export class EnvModule {}