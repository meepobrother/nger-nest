import { nestPlatform } from '../lib'
import { AppModule, DemoController } from './app.module'
nestPlatform().bootstrapModule(AppModule).then(res => {
    const demo = res.injector.get(DemoController)
    debugger;
});
