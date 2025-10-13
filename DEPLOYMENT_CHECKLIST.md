# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Code reviewed and tested
- [ ] No console.logs in production code
- [ ] Error handling implemented

### Environment Setup
- [ ] Production database created
- [ ] All environment variables set
- [ ] `NEXTAUTH_SECRET` is unique and secure (min 32 chars)
- [ ] `DATABASE_URL` points to production database
- [ ] `NEXTAUTH_URL` set to production domain

### Database
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Production data seeded if needed
- [ ] Database backups configured
- [ ] SSL connection enabled for database

### Security
- [ ] Changed default passwords
- [ ] Secure NEXTAUTH_SECRET generated
- [ ] HTTPS enabled for production domain
- [ ] CORS configured if needed
- [ ] Rate limiting considered
- [ ] SQL injection prevention verified (Prisma handles this)

### Testing
- [ ] Registration flow tested
- [ ] Login flow tested
- [ ] Bundle purchase tested
- [ ] Top-up functionality tested
- [ ] Transaction history verified
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing done

## Deployment Platform Specific

### Vercel
- [ ] Project connected to Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] Build settings verified (Next.js detected automatically)
- [ ] Domain configured
- [ ] SSL certificate active

### Railway
- [ ] PostgreSQL service created
- [ ] Web service created
- [ ] Environment variables set
- [ ] Domain configured
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run start`

### Other Platforms (Render, DigitalOcean, etc.)
- [ ] Node.js version specified (18+)
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run start`
- [ ] Environment variables configured
- [ ] Database connected

## Post-Deployment

### Verification
- [ ] Application loads successfully
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard displays correctly
- [ ] Can purchase bundles
- [ ] Can top-up account
- [ ] Transactions recorded correctly
- [ ] Profile page works
- [ ] Logout works

### Monitoring
- [ ] Error tracking setup (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring enabled
- [ ] Database performance monitored

### Performance
- [ ] Page load times acceptable (<3s)
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN setup if needed

### Documentation
- [ ] Admin credentials documented securely
- [ ] API documentation updated
- [ ] User guide available
- [ ] Support channels established

## Production Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-min-32-chars"

# App
NEXT_PUBLIC_APP_NAME="Kulmiye Data"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Optional: Payment APIs
ZAAD_API_KEY="your-zaad-api-key"
EVCPLUS_API_KEY="your-evcplus-api-key"

# Optional: SMS/Email
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
```

## Rollback Plan

If deployment fails:

1. **Identify the issue**
   - Check deployment logs
   - Check application logs
   - Check database connectivity

2. **Quick fixes**
   ```bash
   # Rebuild
   npm run build
   
   # Check database
   npm run db:studio
   
   # Reset database (DANGER!)
   npm run db:push --force-reset
   npm run db:seed
   ```

3. **Rollback steps**
   - Revert to previous deployment
   - Restore database backup if needed
   - Verify previous version works

## Support & Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review performance metrics
- [ ] Check database size/usage
- [ ] Update dependencies monthly
- [ ] Security patches applied promptly
- [ ] User feedback reviewed

### Scaling Considerations
- [ ] Database connection pooling
- [ ] CDN for static assets
- [ ] Load balancing if needed
- [ ] Database read replicas
- [ ] Caching layer (Redis)

## Emergency Contacts

- **Developer**: [Your contact]
- **DevOps**: [Contact]
- **Database Admin**: [Contact]
- **Support**: support@kulmiyedata.com

## Sign-off

- [ ] Development team approved
- [ ] Testing team approved
- [ ] Product owner approved
- [ ] Security review completed
- [ ] Ready for production deployment

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: _______________

---

Good luck with your deployment! 🚀
