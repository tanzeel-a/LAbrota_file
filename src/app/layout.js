import './globals.css';
import ClickSound from '@/components/ClickSound';

export const metadata = {
    title: 'Lab Task Manager',
    description: 'Manage lab tasks and rosters',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ClickSound />
                {children}
            </body>
        </html>
    );
}
