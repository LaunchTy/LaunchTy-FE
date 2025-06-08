'use client'
import AnimatedBlobs from '@/components/UI/background/AnimatedBlobs'
import Button from '@/components/UI/button/Button'
import SplitText from '@/components/UI/text-effect/SplitText'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCharityStore } from '@/store/charity/CreateCharityStore'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import ProjectHeader from '@/components/project-component/ProjectHeader'
import ThumbNailCarousel from '@/components/UI/carousel/ThumbnailCarousel'
import { Modal, ModalBody, ModalContent } from '@/components/UI/modal/AnimatedModal'
import DonateArea from '@/components/UI/shared/DonateArea'
import HistoryEvidence from '@/components/charity/charity-detail-section/HistoryEvidence'
import AddressInfo from '@/components/charity/charity-detail-section/AddressInfo'
import CountdownTimer from '@/components/UI/countdown/CountdownTimer'
import ErrorModal from '@/components/UI/modal/ErrorModal'
import LoadingModal from '@/components/UI/modal/LoadingModal'
import LockModal from '@/components/UI/modal/LockModal'
import { useAccount } from 'wagmi'
import { Charity } from '@/interface/interface'

const Preview = () => {
    const router = useRouter()
    const params = useParams()
    const { address } = useAccount()
    const [loading, setLoading] = useState(false)
    const [lockOpen, setLockOpen] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorCode, setErrorCode] = useState('')
    const [backgroundImage, setBackgroundImage] = useState<string>('')
    const [charity, setCharity] = useState<Charity | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const {
        projectName,
        shortDescription,
        longDescription,
        representativeName,
        phoneNumber,
        socialLinks,
        logo,
        images,
        licenseAndCertification,
        historyEvidence,
        personalId,
        faceId,
        startDate,
        endDate,
        selectedToken,
        tokenSupply,
        setProjectName,
        setShortDescription,
        setLongDescription,
        setRepresentativeName,
        setPhoneNumber,
        setSocialLink,
        setLogo,
        setImages,
        setLicenseAndCertification,
        setHistoryEvidence,
        setPersonalId,
        setFaceId,
        setStartDate,
        setEndDate,
        setSelectedToken,
        setTokenSupply,
        resetStore
    } = useCharityStore()

    useEffect(() => {
        if (!address) {
            setLockOpen(true)
            return
        }
        setLockOpen(false)
    }, [address])

    useEffect(() => {
        const fetchCharity = async () => {
            if (!params.charity_id) return

            try {
                setIsLoading(true)
                const response = await fetch(`/api/charity/get/${params.charity_id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch charity data')
                }
                const data = await response.json()
                if (data.success) {
                    setCharity(data.data)
                    // Update store with fetched data
                    setProjectName(data.data.charity_name)
                    setShortDescription(data.data.charity_short_des)
                    setLongDescription(data.data.charity_long_des)
                    setRepresentativeName(data.data.repre_name)
                    setPhoneNumber(data.data.repre_phone)
                    setSocialLink('facebook', data.data.charity_fb || '')
                    setSocialLink('twitter', data.data.charity_x || '')
                    setSocialLink('instagram', data.data.charity_ig || '')
                    setSocialLink('website', data.data.charity_website || '')
                    setLogo(data.data.charity_logo)
                    setImages(data.data.charity_img)
                    setLicenseAndCertification(data.data.license_certificate)
                    setHistoryEvidence(data.data.evidence[0] || null)
                    setPersonalId(data.data.repre_id)
                    setFaceId(data.data.repre_faceid)
                    setStartDate(data.data.charity_start_date)
                    setEndDate(data.data.charity_end_date)
                    setSelectedToken(data.data.charity_token_symbol)
                    setTokenSupply(data.data.charity_token_supply?.toString() || '')

                    if (data.data.charity_img && data.data.charity_img.length > 0) {
                        setBackgroundImage(data.data.charity_img[0])
                    }
                } else {
                    throw new Error(data.error || 'Failed to fetch charity data')
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (params.charity_id) {
            fetchCharity()
        }
    }, [params.charity_id])

    const handleImageChange = (imageSrc: string) => {
        setBackgroundImage(imageSrc)
    }

    const handleEdit = () => {
        resetStore()
        router.push(`/charity/edit-charity/${params.charity_id}`)
    }

    const handleSubmit = async () => {
        try {
            if (!address) {
                setLockOpen(true)
                return
            }

            setLoading(true)

            const charityData = {
                charity_name: projectName,
                charity_short_des: shortDescription,
                charity_long_des: longDescription,
                charity_token_symbol: selectedToken || '',
                charity_token_supply: Number(tokenSupply),
                charity_logo: logo,
                charity_fb: socialLinks.facebook || '',
                charity_x: socialLinks.twitter || '',
                charity_ig: socialLinks.instagram || '',
                charity_website: socialLinks.website || '',
                charity_whitepaper: '',
                charity_img: images,
                charity_start_date: startDate,
                charity_end_date: endDate,
                license_certificate: licenseAndCertification,
                evidence: historyEvidence.filter(Boolean),
                repre_name: representativeName,
                repre_phone: phoneNumber,
                repre_id: personalId,
                repre_faceid: faceId,
                wallet_address: address,
            }

            const response = await fetch('/api/charity/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(charityData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create charity')
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.message || 'Failed to create charity')
            }

            router.push('/charity/explore-charity')
        } catch (error: any) {
            console.error('Error creating charity:', error)
            setErrorCode(error?.response?.status?.toString() || '500')
            setErrorMessage(error?.message || 'Failed to create charity')
            setErrorModalOpen(true)
        } finally {
            setLoading(false)
        }
    }

    // Calculate status based on dates
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    let status: 'upcoming' | 'ongoing' | 'finished' = 'finished'
    if (now < start) status = 'upcoming'
    else if (now >= start && now <= end) status = 'ongoing'

    if (isLoading) {
        return <LoadingModal open={isLoading} onOpenChange={setIsLoading} />
    }

    if (error) {
        return (
            <ErrorModal
                open={!!error}
                onOpenChange={() => setError(null)}
                errorMessage={error}
                errorCode="500"
                onRetry={() => {
                    setError(null)
                    router.refresh()
                }}
            />
        )
    }

    if (lockOpen) {
        return (
            <LockModal
                open={lockOpen}
                onUnlock={() => setLockOpen(false)}
                canClose={true}
                message="Please connect your wallet to view the preview."
            />
        )
    }

    return (
        <Modal>
            <div className="relative min-h-screen w-full font-exo pb-10">
                <AnimatedBlobs count={6} />

                {/* Full-width background container */}
                <AnimatePresence mode="wait">
                    {backgroundImage && (
                        <motion.div
                            key={backgroundImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 w-full h-2/3 z-0 bg-cover bg-center scale-110"
                            style={{
                                backgroundImage: `url(${backgroundImage})`,
                                filter: 'blur(15px)',
                            }}
                        />
                    )}
                </AnimatePresence>

                {lockOpen ? (
                    <LockModal
                        open={lockOpen}
                        onUnlock={() => setLockOpen(false)}
                        canClose={true}
                        message="Please connect your wallet to preview the charity."
                    />
                ) : loading ? (
                    <LoadingModal open={loading} onOpenChange={setLoading} />
                ) : (
                    <>
                        <div className="relative px-20 pt-48 pb-12 z-10">
                            <div className="flex justify-between items-center">
                                <ProjectHeader 
                                    projectDetail={{
                                        id: params.charity_id as string || 'preview',
                                        name: projectName,
                                        shortDescription: shortDescription,
                                        longDescription: longDescription,
                                        logo: logo || undefined,
                                        images: images,
                                        startDate: startDate,
                                        endDate: endDate,
                                        facebook: socialLinks.facebook || undefined,
                                        x: socialLinks.twitter || undefined,
                                        instagram: socialLinks.instagram || undefined,
                                        website: socialLinks.website || undefined,
                                        type: 'charity',
                                        status: 'upcoming',
                                        charity_token_symbol: selectedToken || undefined,
                                        evidence: historyEvidence,
                                        repre_name: representativeName || undefined,
                                        repre_phone: phoneNumber || undefined,
                                        repre_faceid: faceId || undefined,
                                        totalDonationAmount: charity?.totalDonationAmount || 0,
                                        donations: charity?.donations || []
                                    }} 
                                />
                                <CountdownTimer
                                    endTime={endDate}
                                />
                            </div>
                        </div>

                        <div className="flex items-start justify-center gap-12">
                            <div className="w-10/12">
                                <ThumbNailCarousel
                                    projectImages={images.map(img => ({
                                        src: img,
                                        alt: projectName,
                                        description: projectName
                                    }))}
                                    fullWidthBackground={false}
                                    onImageChange={handleImageChange}
                                />
                                <div className="mb-28 mt-10 flex flex-col gap-5 h-auto w-full rounded-xl glass-component-1 p-8 pb-16">
                                    <span className="text-[45px] font-bold">Description</span>
                                    <span>{longDescription}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start justify-center gap-9">
                            <div className="w-6/12">
                                <div className="h-[500px]">
                                    <HistoryEvidence
                                        images={Array.isArray(historyEvidence) 
                                            ? historyEvidence
                                                .filter(Boolean)
                                                .map((img, index) => ({
                                                    src: img,
                                                    alt: `Charity evidence ${index + 1}`
                                                }))
                                            : []}
                                    />
                                </div>
                                <AddressInfo
                                    fields={[
                                        {
                                            label: 'Representative Name',
                                            value: representativeName,
                                        },
                                        {
                                            label: 'Phone',
                                            value: phoneNumber,
                                        },
                                        {
                                            label: 'Status',
                                            value: status,
                                        },
                                    ]}
                                />
                            </div>
                            <div className="w-4/12 h-fit top-12 flex flex-col">
                                <div className="h-[500px] flex flex-col gap-5 w-full">
                                    <DonateArea enabled={false} />
                                </div>
                                <AddressInfo
                                    fields={[
                                        {
                                            label: 'Total charity raised',
                                            value: charity?.totalDonationAmount?.toString() || '0',
                                        },
                                        {
                                            label: 'Total donors',
                                            value: charity?.donations?.length.toString() || '0',
                                        },
                                        {
                                            label: 'Token Symbol',
                                            value: selectedToken || 'Not set',
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                            <Button
                                onClick={handleEdit}
                                className="glass-component-3 px-8 py-3 rounded-xl text-white hover:bg-opacity-80 transition-all duration-300"
                            >
                                Edit Information
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="glass-component-3 px-8 py-3 rounded-xl text-white hover:bg-opacity-80 transition-all duration-300"
                            >
                                Submit Charity
                            </Button>
                        </div>
                    </>
                )}

                <ErrorModal
                    open={errorModalOpen}
                    onOpenChange={setErrorModalOpen}
                    errorCode={errorCode}
                    errorMessage={errorMessage}
                    onRetry={() => {
                        setErrorModalOpen(false)
                        handleSubmit()
                    }}
                />
            </div>
        </Modal>
    )
}

export default Preview 