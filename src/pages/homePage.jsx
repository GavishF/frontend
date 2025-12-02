import { useEffect } from 'react';
import startSocialProof from '../utils/socialProof';
import FreeShippingBar from '../components/FreeShippingBar';
import Recommended from '../components/Recommended';

export default function HomePage(){
    useEffect(()=>{
        const stop = startSocialProof(11000);
        return ()=>{ if(typeof stop === 'function') stop(); };
    },[]);

    return(
        <div className="px-4 py-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="mt-2 text-gray-600">Hand-picked picks and live social proof to help you decide.</p>
            </div>

            <FreeShippingBar />

            <section className="mt-6">
              <Recommended />
            </section>
        </div>
    )
}