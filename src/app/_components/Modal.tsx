'use client'

type ModalProps = {
    closeModal: () => void
}

export default function Modal({ closeModal }: ModalProps) {
    return (
        <div className="fixed left-0 top-0 z-30 flex h-full w-full flex-col items-center justify-center gap-8 bg-black/50">
            <button
                className="fixed left-0 top-0 h-full w-full cursor-default"
                onClick={closeModal}
            ></button>
            <input
                type="text"
                placeholder="Тег пользователя"
                className="z-50 rounded-xl bg-[#6B416B] p-4 italic"
            />
            <button className="z-50 rounded-xl bg-[#926192] p-4 px-6">
                Добавить участника
            </button>
        </div>
    )
}
