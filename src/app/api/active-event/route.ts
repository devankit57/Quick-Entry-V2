import { NextResponse } from "next/server"
import { MongoClient} from "mongodb"

// MongoDB connection string (replace with your actual connection string)
const uri = process.env.MONGO_URI as string

export async function GET() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db("quick-entry")
    const eventsCollection = database.collection("events")

    // Find the active event
    const activeEvent = await eventsCollection.findOne({ status: "active" })

    if (activeEvent) {
      return NextResponse.json({ eventName: activeEvent.name }, { status: 200 })
    } else {
      return NextResponse.json({ message: "No active event found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching active event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

