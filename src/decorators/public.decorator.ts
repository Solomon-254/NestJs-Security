import { SetMetadata } from '@nestjs/common'; //attaches metadata to a class or property

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

//The purpose of this code is to create a custom decorator called @Public that can 
// be used to mark certain controller methods or routes as public. 
// This decorator can be used in combination with other decorators 
// or guards to control access to specific routes or methods based on whether they are marked as public or not.