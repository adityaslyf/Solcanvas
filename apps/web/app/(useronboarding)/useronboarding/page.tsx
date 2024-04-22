"use client";
import { useState, useEffect } from "react";
import { ChangeEvent } from "react";
import required from "../../../public/images/required.png";
import next from "../../../public/images/next.png";
import Image from "next/image";
import { useRouter } from "next/navigation"; // corrected import statement
import supabase from '../../../supabase';
import { useWallet } from '@solana/wallet-adapter-react';

export default function UserOnBoarding() {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const router = useRouter();
    const { publicKey } = useWallet();
    console.log("hello");
    // console.log(publicKey?.toBase58());
    const saveWalletId = async (walletId: string) => {
        try {
            // Insert wallet ID into the database
            const { data, error } = await supabase.from('onboarding').insert([{ wallet_id: walletId }]);
            if (error) {
                throw error;
            }
            console.log('Wallet ID saved successfully:', data);
            // Set redirecting state to true and redirect the user
            //   setRedirecting(true);
            // router.push("/useronboarding");
        } catch (error: any) {
            // Log and handle errors
            console.error('Error saving wallet ID:', error.message);
            // Optionally, provide feedback to the user
            alert('Failed to save wallet ID. Please try again later.');
        }
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue.length <= 45) setName(inputValue);
    };

    const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue.length <= 80) setBio(inputValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Save name, bio, and wallet ID
            const { data, error } = await supabase.from('onboarding').insert([
                { name, bio, wallet_id: publicKey?.toString() } // Added null check for publicKey
            ]);
            if (error) {
                throw error;
            }
            console.log('Data inserted successfully:', data);

            // Redirect to add project page
            router.push("/addproject");
        } catch (error: any) {
            console.error('Error inserting data:', error.message);
            // Optionally, provide feedback to the user
            alert("Failed to insert data. Please try again later.");
        }
    };

    return (
        <form className="flex flex-col self- sm:mt-24 font-nunito max-w-full mt-10 " onSubmit={handleSubmit}>
            <div className="flex gap-2.5 self-start">
                <div className="shrink-0 rounded-2xl bg-zinc-400 h-[17px] w-[38px]" />
                <div className="shrink-0 w-14 bg-[#954AD2] rounded-2xl h-[17px]" />
                <div className="shrink-0 rounded-2xl bg-zinc-400 h-[17px] w-[38px]" />
            </div>
            <div className="mt-11 sm:text-5xl font-silkscreen font-semibold tracking-wide leading-8 text-white max-w-full text-4xl">
                Onboarding
            </div>
            <div className="mt-5 text-2xl font-nunito font-medium tracking-wide leading-8 text-white text-opacity-50 max-w-full">
                Lets get started by telling the world your <br />
                name and about yourself.
            </div>
            <div className="flex gap-5 justify-between  w-full text-2xl tracking-wide leading-8 whitespace-nowrap sm:flex-none flex-wrap mt-10 max-w-full">
                <div className="flex flex-1 self-start text-white text-opacity-80">
                    <div>Name</div>
                    <Image
                        alt=""
                        width={100}
                        height={100}
                        loading="lazy"
                        src={required}
                        className="shrink-0 self-start w-3.5 aspect-square"
                    />
                </div>
            </div>
            <input
                className="justify-center items-start p-5 mt-4 sm:text-xl font-medium tracking-wide leading-8 bg-[#DFA9FE] rounded-xl border border-solid border-white border-opacity-20 placeholder:opacity-40 placeholder:font-nunito placeholder:text-black text-black text-opacity-70 "
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
                required
            />
            <div className="flex gap-5  w-full text-2xl tracking-wide leading-8 whitespace-nowrap flex-wrap mt-10 max-w-full">
                <div className="flex flex-1  self-start text-white text-opacity-80">
                    <div>Bio</div>
                    <Image
                        alt=""
                        width={100}
                        height={100}
                        loading="lazy"
                        src={required}
                        className="shrink-0 self-start w-3.5 aspect-square"
                    />
                </div>
            </div>
            <input
                className="justify-center bg-[#DFA9FE] items-start p-5 mt-4 sm:text-xl font-medium tracking-wide leading-8 rounded-xl border border-solid border-white border-opacity-20 text-black text-opacity-70 placeholder:opacity-40 placeholder:font-nunito placeholder:text-black px-5 max-w-full"
                placeholder="Give intro about yourself"
                value={bio}
                onChange={handleBioChange}
                required
            />
            <div className="flex gap-5 justify-end  w-full text-2xl font-medium tracking-wide leading-7 whitespace-nowrap flex-wrap sm:mt-20 mt-10 max-w-full">

                <button type="submit" className="flex gap-5  font-nunito justify-between  items-center sm:-mr-12 sm:px-7 py-4 text-white text-opacity-80 bg-[#954AD2] rounded-3xl px-5">
                    <div>Finish</div>
                    <Image
                        alt=""
                        width={100}
                        height={100}
                        loading="lazy"
                        src={next}
                        className="shrink-0 w-4  aspect-[0.76] stroke-[2px] stroke-white"
                    />
                </button>
            </div>
        </form>
    );
}
