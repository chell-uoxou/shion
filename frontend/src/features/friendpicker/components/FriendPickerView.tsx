import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Check } from "lucide-react";
import UserRow from "@/features/FriendListitem/page";
import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";

type User = {
    id: string
    name: string
}

type UserSelectDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    users: User[]
    onConfirm: (selected: User[]) => void
}

export default function UserSelectDialog({
    open,
    onOpenChange,
    users,
    onConfirm
}: UserSelectDialogProps) {
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
            {/* 背景だけ暗くする */}
            <DialogOverlay className="fixed inset-0 bg-black/40" />

            {/* ダイアログ本体 */}
            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md bg-[var(--brand-violet-1)] h-[500px] p-4">
                <DialogHeader>
                    <DialogTitle className="text-xl text-[var(--brand-violet-4)]">
                        ＜話し相手を追加＞
                    </DialogTitle>
                </DialogHeader>
                <SearchForm />
                {/* ユーザーリスト部分（枠なし） */}
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {users.map(user => (
                        <UserRow key={user.id} src="/user-icon.svg" name={user.name} />
                    ))}
                </div>

                {/* 決定ボタン */}
                <div className="flex justify-center mt-2">
                    <button
                        type="button"
                        className="w-35 h-14 rounded-xl bg-[var(--brand-violet-3)] flex items-center justify-center"
                        aria-label="話し相手追加ボタン"
                    >
                        <Check size={26} style={{ color: "var(--brand-violet-1)" }} />
                    </button>
                </div>
            </DialogContent>

        </Dialog>
    )
}
