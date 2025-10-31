const express = require('express');
const puppeteer = require('puppeteer');


// helper: check daily usage and increment
async function checkAndIncrementUsage(user) {
const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
let usage = user.usages.find(u => u.date === today);
if (!usage) {
usage = { date: today, count: 0 };
user.usages.push(usage);
}


// Free tier limit
if (user.plan === 'free' && usage.count >= 10) {
return { allowed: false, remaining: 0 };
}


usage.count += 1;
await user.save();


return { allowed: true, remaining: user.plan === 'free' ? Math.max(0, 10 - usage.count) : Infinity };
}


router.post('/', async (req, res) => {
const url = req.body.url;
const user = req.user; // from auth middleware
if (!url) return res.status(400).json({ error: 'url required' });


try {
const chk = await checkAndIncrementUsage(user);
if (!chk.allowed) return res.status(402).json({ error: 'Free daily limit reached. Upgrade to Pro.' });


// launch puppeteer and convert URL to PDF buffer
const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });


const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
await browser.close();


// send PDF as download
const filename = `pdfly-${Date.now()}.pdf`;
res.set({
'Content-Type': 'application/pdf',
'Content-Disposition': `attachment; filename="${filename}"`
});
res.send(pdfBuffer);
} catch (err) {
console.error('Conversion error:', err);
return res.status(500).json({ error: 'Failed to convert URL to PDF' });
}
});


module.exports = router;