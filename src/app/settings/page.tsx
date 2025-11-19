'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/settings/settings-form"
import { ThemeSwitch } from "@/components/theme/theme-switch"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { MotionButton } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
         <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <MotionButton 
                        onClick={() => router.back()}
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }} 
                        variant="ghost" 
                        size="icon"
                        className="mr-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </MotionButton>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
            </Tooltip>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
      </div>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Theme</h3>
              <Separator />
              <ThemeSwitch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
