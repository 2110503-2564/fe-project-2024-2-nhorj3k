'use client'
import styles from './banner.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Banner () {
    const router = useRouter();

    const { data: session } = useSession();
    console.log(session?.user.token);
    
    return (
        <div className={styles.banner}>
            <Image src={'/img/cover.jpg'} 
            alt='cover'
            fill={true}
            objectFit= 'cover'
            priority
            />
            <div className={styles.bannerText}>
                <h1 className='text-4xl font-bold font-serif text-white'>Plan Your Trip With Ease</h1>
                <h3 className='text-xl font-serif text-white'>"Rain or shine, your ride's on time"</h3>
                <button className='bg-white text-black font-semibold font-serif py-2 px-4 mt-5
                        rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 absolute top-50 left-1/2 transform -translate-x-1/2'
                        onClick={() => {router.push('/venue')}}>
                            Check out our providers across the borders!
                </button>
            </div>
            {
                session? <div className='z-30 absolute top-5 right-10 font-bold font-serif text-white text-xl'
                            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.75)' }}>
                        Welcome {session.user?.name}</div>
                        : null
            }
        </div> 
    );
}

