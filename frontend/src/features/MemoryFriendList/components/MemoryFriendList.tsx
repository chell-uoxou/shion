// MemoryFriendDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog"
import { useState } from "react"
import { X } from "lucide-react"
import UserRow from "@/features/memoryfrienditem/components/MemoryFrienditem"

type User = {
    id: string
    name: string
    comment?: string   // ← コメントを追加
}

type MemoryFriendDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    users: User[]
    onConfirm: (selected: User[]) => void
}

export default function MemoryFriendDialog({
    open,
    onOpenChange,
    users,
    onConfirm
}: MemoryFriendDialogProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [query, setQuery] = useState("")

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="fixed inset-0 bg-black/40" />

            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md bg-[var(--brand-violet-1)] h-[500px] p-4">
                <DialogHeader>
                    <DialogTitle className="text-xl text-[var(--brand-violet-4)]">
                        ＜話し相手一覧＞
                    </DialogTitle>
                </DialogHeader>

                {/* ユーザーリスト */}
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {users.map(user => (
                        <div
                            key={user.id}
                            className="cursor-pointer"
                            onClick={() => {
                                onConfirm([user])
                                onOpenChange(false)
                            }}
                        >
                            {/* 👇 コメントを渡す */}
                            <UserRow src="/user-icon.svg" name={user.name} comment={user.comment} />
                        </div>
                    ))}
                </div>

                {/* 閉じるボタン */}
                <div className="flex justify-center mt-2">
                    <button
                        type="button"
                        className="w-35 h-14 rounded-xl bg-white flex items-center justify-center"
                        aria-label="閉じるボタン"
                        onClick={() => onOpenChange(false)} // ← 閉じられるように修正
                    >
                        <X size={26} style={{ color: "var(--brand-violet-3)" }} />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
