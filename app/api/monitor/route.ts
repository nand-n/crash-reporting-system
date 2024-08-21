import { NextResponse } from 'next/server';
import axios from 'axios';
import { pool } from '@/lib/db';

async function checkService(service: { id: number; url: string }) {
  try {
    const startTime = Date.now();
    await axios.get(service.url);
    const responseTime = Date.now() - startTime;

    await pool.query(
      'INSERT INTO uptime_logs (service_id, status, response_time) VALUES ($1, $2, $3)',
      [service.id, 'up', responseTime]
    );
  } catch (error) {
    await pool.query(
      'INSERT INTO uptime_logs (service_id, status) VALUES ($1, $2)',
      [service.id, 'down']
    );

    const { rows: openIncident } = await pool.query(
      'SELECT * FROM incidents WHERE service_id = $1 AND resolved_at IS NULL',
      [service.id]
    );

    if (!openIncident.length) {
      await pool.query(
        'INSERT INTO incidents (service_id, description) VALUES ($1, $2)',
        [service.id, 'Service is down']
      );
    }
  }
}

export async function GET() {
  const { rows: services } = await pool.query('SELECT * FROM services');

  await Promise.all(services.map(checkService));

  return NextResponse.json({ message: 'Monitoring completed' });
}
