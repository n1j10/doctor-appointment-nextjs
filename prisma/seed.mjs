import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, Role } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultPassword = process.env.SEED_PROVIDER_PASSWORD || 'Doctor@123';

const doctors = [
  {
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@bookwell.demo',
    specialty: 'Cardiology',
    bio: 'Board-certified cardiologist focused on preventive heart care, hypertension, and long-term wellness plans.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.9,
    reviewCount: 1240,
    services: [
      { name: 'Cardiology Consultation', description: 'Heart health review and treatment plan', duration: 30, price: 150 },
      { name: 'ECG Interpretation', description: 'Electrocardiogram analysis and summary', duration: 25, price: 120 },
      { name: 'Follow-up Visit', description: 'Progress check and medication adjustments', duration: 20, price: 90 },
    ],
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@bookwell.demo',
    specialty: 'Orthopedics',
    bio: 'Sports medicine and orthopedic specialist helping patients recover from injuries and return to activity safely.',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    reviewCount: 980,
    services: [
      { name: 'Orthopedic Assessment', description: 'Bone and joint pain evaluation', duration: 40, price: 170 },
      { name: 'Sports Injury Consultation', description: 'Injury diagnosis with rehabilitation guidance', duration: 35, price: 160 },
      { name: 'Post-op Follow-up', description: 'Surgery recovery and mobility monitoring', duration: 20, price: 100 },
    ],
  },
  {
    name: 'Dr. Emily Chen',
    email: 'emily.chen@bookwell.demo',
    specialty: 'Dermatology',
    bio: 'Dermatologist providing acne management, skin screenings, and personalized treatment for chronic skin issues.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.7,
    reviewCount: 760,
    services: [
      { name: 'Skin Consultation', description: 'Diagnosis for skin, hair, and nail concerns', duration: 30, price: 130 },
      { name: 'Acne Treatment Plan', description: 'Customized care for persistent acne', duration: 25, price: 110 },
      { name: 'Mole Check', description: 'Clinical skin screening and risk review', duration: 20, price: 95 },
    ],
  },
  {
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@bookwell.demo',
    specialty: 'Neurology',
    bio: 'Neurologist treating headaches, neuropathy, and movement disorders with evidence-based diagnostics.',
    avatarUrl: 'https://randomuser.me/api/portraits/men/54.jpg',
    rating: 4.9,
    reviewCount: 640,
    services: [
      { name: 'Neurology Consultation', description: 'Comprehensive neurological exam', duration: 45, price: 190 },
      { name: 'Migraine Management', description: 'Headache triggers, medications, and prevention plan', duration: 30, price: 135 },
      { name: 'Nerve Pain Follow-up', description: 'Symptom tracking and treatment update', duration: 25, price: 110 },
    ],
  },
  {
    name: 'Dr. Layla Kareem',
    email: 'layla.kareem@bookwell.demo',
    specialty: 'Pediatrics',
    bio: 'Pediatrician dedicated to preventive care, growth monitoring, and compassionate support for children and families.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/51.jpg',
    rating: 4.8,
    reviewCount: 1120,
    services: [
      { name: 'Child Wellness Visit', description: 'Routine growth and health evaluation', duration: 25, price: 85 },
      { name: 'Pediatric Sick Visit', description: 'Same-day assessment for common illnesses', duration: 20, price: 75 },
      { name: 'Vaccination Appointment', description: 'Immunization review and administration', duration: 15, price: 60 },
    ],
  },
  {
    name: 'Dr. Michael Brown',
    email: 'michael.brown@bookwell.demo',
    specialty: 'General Medicine',
    bio: 'Family physician managing chronic conditions, preventive screenings, and primary care for adults.',
    avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
    rating: 4.6,
    reviewCount: 1500,
    services: [
      { name: 'General Checkup', description: 'Annual health exam and risk assessment', duration: 30, price: 95 },
      { name: 'Chronic Care Follow-up', description: 'Diabetes, blood pressure, and lifestyle review', duration: 25, price: 90 },
      { name: 'Lab Result Review', description: 'Interpretation and next-step planning', duration: 20, price: 70 },
    ],
  },
];

const weeklyAvailability = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
];

async function seedDoctors() {
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  for (const doctor of doctors) {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email: doctor.email },
        create: {
          email: doctor.email,
          name: doctor.name,
          passwordHash,
          role: Role.PROVIDER,
          image: doctor.avatarUrl,
        },
        update: {
          name: doctor.name,
          passwordHash,
          role: Role.PROVIDER,
          image: doctor.avatarUrl,
        },
        select: { id: true },
      });

      const provider = await tx.provider.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          specialty: doctor.specialty,
          bio: doctor.bio,
          avatarUrl: doctor.avatarUrl,
          rating: doctor.rating,
          reviewCount: doctor.reviewCount,
        },
        update: {
          specialty: doctor.specialty,
          bio: doctor.bio,
          avatarUrl: doctor.avatarUrl,
          rating: doctor.rating,
          reviewCount: doctor.reviewCount,
        },
        select: { id: true },
      });

      await tx.service.deleteMany({ where: { providerId: provider.id } });
      await tx.availability.deleteMany({ where: { providerId: provider.id } });

      await tx.service.createMany({
        data: doctor.services.map((service) => ({
          providerId: provider.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
        })),
      });

      await tx.availability.createMany({
        data: weeklyAvailability.map((slot) => ({
          providerId: provider.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      });
    });
  }
}

async function main() {
  await seedDoctors();

  const providerCount = await prisma.provider.count();
  const serviceCount = await prisma.service.count();
  const availabilityCount = await prisma.availability.count();

  console.log('Seed complete.');
  console.log(`Providers: ${providerCount}`);
  console.log(`Services: ${serviceCount}`);
  console.log(`Availability slots: ${availabilityCount}`);
  console.log(`Provider default password: ${defaultPassword}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
