import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Image
                src="/logo.png"
                alt="Deriverse Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
            />
        </div>
    );
}
