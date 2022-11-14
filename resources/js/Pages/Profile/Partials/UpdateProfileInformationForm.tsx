import React, { useEffect, useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import { Transition } from '@headlessui/react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { ProfileEditProps } from '@/type';

interface UpdateProfileInformationProps extends ProfileEditProps {
    className?: string;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className,
}: UpdateProfileInformationProps) {
    const user = useTypedPage().props.auth.user;
    const route = useRoute();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className='text-lg font-medium text-gray-900'>Profile Information</h2>

                <p className='mt-1 text-sm text-gray-600'>
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className='mt-6 space-y-6'>
                <div>
                    <InputLabel forInput='name' value='Name' />

                    <TextInput
                        id='name'
                        type='text'
                        className='mt-1 block w-full'
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete='name'
                    />

                    <InputError className='mt-2' message={errors.name} />
                </div>

                <div>
                    <InputLabel forInput='email' value='Email' />

                    <TextInput
                        id='email'
                        type='email'
                        className='mt-1 block w-full'
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete='email'
                    />

                    <InputError className='mt-2' message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className='mt-2 text-sm'>
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method='post'
                                as='button'
                                className='text-gray-600 underline hover:text-gray-900'>
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className='mt-2 text-sm font-medium text-green-600'>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className='flex items-center gap-4'>
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom='opacity-0'
                        leaveTo='opacity-0'
                        className='transition ease-in-out'>
                        <p className='text-sm text-gray-600'>Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}