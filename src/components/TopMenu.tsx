import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Link from 'next/link';

export default async function TopMenu() {
    const session = await getServerSession(authOptions);

    return (
        <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-md text-white px-6 py-2 flex flex-row items-center justify-between z-50">
            <div>
                <Link href='/'>
                <Image src="/img/logo.png" alt="Logo" width={50} height={25}/>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <TopMenuItem title="My Booking" pageRef="/mybooking" />
                {session ? (
                    <Link href="/api/auth/signout">
                        <div className="px-4 py-2 text-white bg-blue-700 rounded rounded-lg font-bold text-sm
                                        shadow-lg hover:bg-blue-600 transition duration-300">
                            Sign-Out
                        </div>
                    </Link>
                ) : (
                    <>
                        <Link href="/api/auth/signin">
                            <div className="px-4 py-2 text-black bg-white rounded rounded-lg font-bold text-sm
                                            shadow-lg hover:bg-gray-300 transition duration-300">
                                Sign-In
                            </div>
                        </Link>
                        <Link href="/register">
                            <div className="px-4 py-2 text-white bg-blue-700 rounded rounded-lg font-bold text-sm
                                            shadow-lg hover:bg-blue-600 transition duration-300">
                                Register
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
