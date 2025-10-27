import '../styles/globals.css'
import AnimatedFrame from '../components/AnimatedFrame'

export const metadata = {
  title: 'George Tatevosov | DevOps Engineer',
  description: 'DevOps Engineer & Technical Lead - Infrastructure automation at scale',
  keywords: ['DevOps', 'Kubernetes', 'Docker', 'AWS', 'Infrastructure', 'Automation'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
