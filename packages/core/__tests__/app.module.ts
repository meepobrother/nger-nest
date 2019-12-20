import {
    Module, OnModuleInit, Injectable,
    Inject, Controller,
    Get, Post, Optional, Query,
} from '@nestjs/common';
import { DemoModule } from './demo';

@Injectable()
export class Demo2 { }

@Injectable()
export class Demo {
    constructor() { }
}

@Controller()
export class DemoController {
    constructor(
        public demo2: Demo2,
        @Inject(Demo) @Optional() public demo: Demo
    ) { }

    @Get('/index')
    getIndex(@Query(`query`) query: any) {
        return 'success'
    }
    @Post('/login')
    login() {
        return 'success'
    }
}

@Module({
    providers: [
        Demo,
        Demo2
    ],
    imports: [DemoModule],
    controllers: [DemoController]
})
export class AppModule implements OnModuleInit {
    onModuleInit() { }
}
