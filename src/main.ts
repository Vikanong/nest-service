import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { ResponseInterceptor } from './filters/response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, '../public')));

    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe());

    // 全局注册拦截器
    app.useGlobalFilters(new AllExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    const port = process.env.PORT || 3000; // 从环境变量中获取端口，如果没有则使用默认端口 3000

    await app.listen(port);
}
bootstrap();
