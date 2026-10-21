import { AppleHelloEffectEnglish } from "@/components/apple-hello-effect-english";
import { AppleHelloEffectHindi } from "../apple-hello-effect-hindi";

export const LandingGreeting = ({ durationScale }: { durationScale: number }) => {
    return (
        <section className="w-full h-dvh flex flex-row gap-96 items-center justify-center">
            <AppleHelloEffectEnglish durationScale={durationScale} />
            <AppleHelloEffectHindi durationScale={durationScale} />
        </section>
    );
};
