'use client'

import {
    Button,
    FieldError,
    FieldGroup,
    Fieldset,
    Form,
    Input,
    Label,
    TextField
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


type LoginBody = {
    email: string;
    password: string;
};


export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const data = {
            email,
            password,
        } satisfies LoginBody

        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        })

        if (res.ok) {
            router.push("/dashboard");
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Fieldset className="w-full">
                    <Fieldset.Legend className="pb-3 text-slate-600 text-2xl font-bold" >Login</Fieldset.Legend>
                    <FieldGroup>
                        <TextField
                        isRequired
                        >
                            <Label>Email</Label>
                            <Input type="email" placeholder="example@email.com" onChange={(e) => setEmail(e.currentTarget.value)}/>
                            <FieldError />
                        </TextField>
                       <TextField
                        isRequired
                        minLength={8}
                        name="password"
                        validate={(value) =>{
                            if (value.length < 8) {
                                return "Password must be at least 8 characters";
                            }
                            if (!/[A-Z]/.test(value)) {
                                return "Password must contain at least one uppercase letter";
                            }
                            if (!/[0-9]/.test(value)) {
                                return "Password must contain at least one number";
                            }
                            return null;
                        }}
                        >
                            <Label>Password</Label>
                            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.currentTarget.value)}/>
                            <FieldError />
                        </TextField>
                    </FieldGroup>
                    <Fieldset.Actions>
                        <Button type="submit">Login</Button>
                        <Button type="reset">Reset</Button>
                    </Fieldset.Actions>
                </Fieldset>
                <div className="mt-2"><p>Need an account? <Link href={"/register"} className="underline">Register</Link></p></div>
            </Form>
        </>
    )
} 