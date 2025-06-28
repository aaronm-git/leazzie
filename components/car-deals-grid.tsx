"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AddCarDealDialog } from "./add-car-deal-dialog"

interface CarDeal {
  id: string
  title: string
  description: string | null
  image_url: string | null
  created_at: string
}

interface CarDealsGridProps {
  initialCarDeals: CarDeal[]
}

export function CarDealsGrid({ initialCarDeals }: CarDealsGridProps) {
  const [carDeals, setCarDeals] = useState<CarDeal[]>(initialCarDeals)

  const handleCarDealAdded = (newCarDeal: CarDeal) => {
    setCarDeals((prev) => [newCarDeal, ...prev])
  }

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Car Deals</h1>
          <p className="text-gray-600 mt-1">Track and compare lease deals across multiple vehicles</p>
        </div>
        <AddCarDealDialog onCarDealAdded={handleCarDealAdded}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Car Deal
          </Button>
        </AddCarDealDialog>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {carDeals.map((deal) => (
          <Link href={`/${deal.id}/deals`} key={deal.id}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="p-0">
                <img
                  src={deal.image_url || "/placeholder.svg?width=400&height=250&query=car"}
                  alt={deal.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{deal.title}</CardTitle>
                <CardDescription className="text-sm">{deal.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}

        {carDeals.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No car deals yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first car deal to track lease offers.</p>
            <AddCarDealDialog onCarDealAdded={handleCarDealAdded}>
              <Button>Create Your First Car Deal</Button>
            </AddCarDealDialog>
          </div>
        )}
      </div>
    </div>
  )
}
