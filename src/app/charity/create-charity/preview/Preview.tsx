'use client'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button'
import SplitText from '@/components/UI/text-effect/SplitText'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useCharityStore } from '@/store/charity/CreateCharityStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Preview = () => {
    const router = useRouter()
    const {
        projectName,
        shortDescription,
        longDescription,
        representativeName,
        phoneNumber,
        socialLinks,
        logo,
        backgroundImage,
        setBackgroundImage,
        images,
        licenseAndCertification,
        historyEvidence,
        personalId,
        faceId,
    } = useCharityStore()

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index)
    }

    const handleBackgroundImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setBackgroundImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Convert socialLinks object to array of non-empty links
    const socialLinksArray = Object.entries(socialLinks)
        .filter(([_, value]) => value.trim() !== '')
        .map(([platform, url]) => ({
            platform,
            url,
        }))

    return (
        <div className="relative p-36 flex flex-col justify-center items-center font-exo">
            <AnimatedBlobs count={4} />
            {/* Background Image Upload */}
            <div className="absolute top-4 right-4 z-30">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageChange}
                    className="hidden"
                    id="backgroundImageUpload"
                />
                <label
                    htmlFor="backgroundImageUpload"
                    className="cursor-pointer glass-component-3 px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-all duration-300"
                >
                    Change Background
                </label>
            </div>

            {/* Project Header */}
            <div className="w-full max-w-4xl mx-auto text-center z-20 mb-8">
                <SplitText
                    text={projectName}
                    className="text-4xl font-bold text-white mb-4"
                    delay={50}
                />
                <SplitText
                    text={shortDescription}
                    className="text-lg text-gray-300"
                    delay={100}
                />
            </div>

            {/* Thumbnail Carousel */}
            <div className="w-full max-w-4xl mx-auto mb-8 z-20">
                <div className="relative h-96 rounded-xl overflow-hidden">
                    {images.length > 0 ? (
                        <Image
                            src={images[currentImageIndex]}
                            alt={`Project image ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center glass-component-2">
                            <span className="text-gray-400">No images uploaded</span>
                        </div>
                    )}
                </div>
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 justify-center">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleImageChange(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentImageIndex === index
                                        ? 'bg-blue-500 scale-125'
                                        : 'bg-gray-500 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Project Details */}
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 z-20">
                {/* Left Column */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-component-2 p-6 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">About</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{longDescription}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-component-2 p-6 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                        <div className="space-y-2">
                            <p className="text-gray-300">
                                <span className="font-semibold">Representative:</span> {representativeName}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold">Phone:</span> {phoneNumber}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-component-2 p-6 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Verification Documents</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {licenseAndCertification && (
                                <div className="relative h-32 rounded-lg overflow-hidden">
                                    <Image
                                        src={licenseAndCertification}
                                        alt="License & Certification"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {historyEvidence && (
                                <div className="relative h-32 rounded-lg overflow-hidden">
                                    <Image
                                        src={historyEvidence}
                                        alt="History Evidence"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {personalId && (
                                <div className="relative h-32 rounded-lg overflow-hidden">
                                    <Image
                                        src={personalId}
                                        alt="Personal ID"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {faceId && (
                                <div className="relative h-32 rounded-lg overflow-hidden">
                                    <Image
                                        src={faceId}
                                        alt="Face ID"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-component-2 p-6 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Social Links</h3>
                        <div className="space-y-2">
                            {socialLinksArray.map(({ platform, url }) => (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 z-20"
            >
                <Button
                    onClick={() => router.push('/charity/create-charity')}
                    className="glass-component-3 px-8 py-3 rounded-xl text-white hover:bg-opacity-80 transition-all duration-300"
                >
                    Edit Information
                </Button>
            </motion.div>
        </div>
    )
}

export default Preview 