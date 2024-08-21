import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const { rows: services } = await pool.query('SELECT * FROM services');
  
    const serviceData = await Promise.all(
      services.map(async (service: any) => {
        const { rows: logs } = await pool.query(
          'SELECT status FROM uptime_logs WHERE service_id = $1',
          [service.id]
        );
  
        const upCount = logs.filter((log) => log.status == 'up').length;
        const totalCount = logs.length;
        const uptimePercentage = totalCount
          ? ((upCount / totalCount) * 100).toFixed(3) 
          : 'N/A';
  
        const dots = logs.slice(-30).map((log) => log.status);
        const status = logs.length > 0 ? logs[logs.length - 1].status : 'N/A';
        return {
          id: service.id,
          name: service.name,
          status,
          uptimePercentage,
          dots, 
        };
      })
    );
  
    return NextResponse.json(serviceData);
  }

  export async function POST(request: Request) {
    const { name, url } = await request.json();
  
    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required.' }, { status: 400 });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO services (name, url) VALUES ($1, $2) RETURNING *',
        [name, url]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ error: 'Failed to add service.' }, { status: 500 });
    }
  }
  