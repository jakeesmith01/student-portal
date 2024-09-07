import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.js'
    },
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000, 
        // Setup api proxy
        proxy: {
            '/api': {
                target: 'http://localhost:3002',
                changeOrigin: true,
              }
        }
    },
})