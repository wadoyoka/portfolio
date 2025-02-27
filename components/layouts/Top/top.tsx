import Image from "next/image"
const Top = () => {
    return (
        <div className="flex-grow container mx-auto px-4 pt-12 mb-12 flex items-center justify-center md:min-h-[90vh]">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                    <div className="text-center col-span-1 md:col-span-3">
                        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold mb-4">
                            Enomoto Atsushi
                        </h1>
                    </div>
                    <div className="flex justify-center md:justify-end col-span-1">
                        <Image
                            src="/logo.png"
                            alt="Enomoto Atsushi"
                            width={300}
                            height={300}
                            className="rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top