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


type RegisterBody = {
    username: string,
    email: string,
    password: string,
    canvasToken: string,
    canvasBaseUrl: string,
};


export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [canvasToken, setCanvasToken] = useState("");
    const [canvasBaseUrl, setCanvasBaseUrl] = useState("");

    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        const data = {
            username,
            email,
            password,
            canvasToken,
            canvasBaseUrl,
        } satisfies RegisterBody

        const res = await fetch("/auth/register", {
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
                    <Fieldset.Legend className="pb-3 text-slate-600 text-2xl font-bold" >Create Account</Fieldset.Legend>
                    <FieldGroup>
                        <TextField
                        isRequired
                        name="username"
                        >
                            <Label>Username:</Label>
                            <Input placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                            <FieldError />
                        </TextField>
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
                        <TextField
                        isRequired
                        minLength={8}
                        name="password"
                        validate={(value) =>{
                            if(value !== password) {
                                return "Passwords must match"
                            }
                        }}>
                            <Label>Confirm Password</Label>
                            <Input type="password" placeholder="Confirm Password" onChange={
                                (e) => { 
                                    setConfirmPassword(e.currentTarget.value)
                                }}/>
                            <FieldError />
                        </TextField>
                        <TextField>
                            <Label>Canvas Access Token</Label>
                            <Input placeholder="Canvas Access Token" onChange={(e) => setCanvasToken(e.target.value)}/>
                            <FieldError />
                        </TextField>
                        <TextField>
                            <Label>Canvas Url</Label>
                            <Input placeholder="Canvas Url" onChange={(e) => setCanvasBaseUrl(e.target.value)}/>
                            <FieldError />
                        </TextField>
                    </FieldGroup>
                    <Fieldset.Actions>
                        <Button type="submit">Register</Button>
                        <Button type="reset">Reset</Button>
                    </Fieldset.Actions>
                </Fieldset>
                <div className="mt-2"><p>Already have an account? <Link href={"/login"} className="underline">Login</Link></p></div>
            </Form>
        </>
    )
} 