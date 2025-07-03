import { HTMLAttributes } from 'react';
export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <div className='flex items-center justify-center gap-2'>
            <img {...props}
                src="/assets/213213.png"
                alt="Image"
            />
            <div className='flex flex-col items-start truncate leading-relaxed'>
                <h1 className='font-bold text-xl'>K2NET</h1>
                <p className='text-sm'>Computer & network solution</p>
            </div>
        </div>
    );
}
