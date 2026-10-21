import Client from "./client";

export function generateStaticParams() {
    return [{ authentication: [] }];
}

export default function SignInPage() {
    return (
        <main className="flex flex-col py-4 h-full max-w-[calc(100dvw-12%)] pl-44">
            <Client />
        </main>
    );
}
