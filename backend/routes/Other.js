const express = require('express');
const { db, Timestamp } = require('../db/database');
const { authenticate, authorize } = require('../middleware/auth');

/* ====== MATERIALS ====== */
const materialRouter = express.Router();

materialRouter.get('/', authenticate, async (req, res) => {
  try {
    const snap = await db.collection('materials').get();
    const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => (a.category||'').localeCompare(b.category||''));
    const low_count = items.filter(m => m.quantity <= m.reorder_point && m.reorder_point > 0).length;
    const total_value = items.reduce((acc, m) => acc + (m.quantity * (m.unit_price||0)), 0);
    const categories = [...new Set(items.map(m => m.category))];
    res.json({ items, low_count, total_value, categories });
  } catch(e) { res.status(500).json({error:e.message}); }
});

materialRouter.post('/', authenticate, authorize('admin','manager'), async (req, res) => {
  try {
    const { code, name, category, brand, quantity, unit, unit_price, reorder_point } = req.body;
    const snap = await db.collection('materials').where('code','==',code).get();
    if(!snap.empty) return res.status(409).json({error:'รหัสวัสดุซ้ำ'});
    const ref = db.collection('materials').doc();
    await ref.set({ id:ref.id, code, name, category, brand:brand||null, quantity:Number(quantity)||0, unit:unit||'ชิ้น', unit_price:Number(unit_price)||0, reorder_point:Number(reorder_point)||5, created_at:Timestamp.now() });
    res.status(201).json({ message:'เพิ่มสำเร็จ', id:ref.id });
  } catch(e){ res.status(500).json({error:e.message}); }
});

materialRouter.post('/:id/stock-in', authenticate, authorize('admin','manager','technician'), async (req, res) => {
  try {
    const qty = Number(req.body.quantity);
    if (!qty || qty <= 0) return res.status(400).json({error:'จำนวนไม่ถูกต้อง'});
    const ref = db.collection('materials').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error:'ไม่พบวัสดุ'});
    await ref.update({ quantity: doc.data().quantity + qty });
    res.json({ message:'รับเข้าคลังสำเร็จ' });
  } catch(e){ res.status(500).json({error:e.message}); }
});

/* ====== USERS ====== */
const userRouter = express.Router();
userRouter.get('/', authenticate, authorize('admin','manager'), async (req, res) => {
  try {
    const snap = await db.collection('users').get();
    let users = snap.docs.map(d => { const dt = d.data(); if(dt.password) delete dt.password; return {id: d.id, ...dt}; });
    if(req.query.role) users = users.filter(u=>u.role === req.query.role);
    res.json(users);
  } catch(e){ res.status(500).json({error:e.message}); }
});
userRouter.patch('/:id/toggle', authenticate, authorize('admin'), async (req, res) => {
  try {
    const ref = db.collection('users').doc(req.params.id);
    const doc = await ref.get();
    if(!doc.exists) return res.status(404).json({error:'ไม่พบผู้ใช้งาน'});
    await ref.update({ is_active: doc.data().is_active ? 0 : 1 });
    res.json({ message:'อัปเดตสถานะสำเร็จ' });
  } catch(e){ res.status(500).json({error:e.message}); }
});

/* ====== EVALUATIONS ====== */
const evalRouter = express.Router();
evalRouter.post('/', authenticate, async (req, res) => {
  try {
    const { request_id, quality_score, speed_score, service_score, comment } = req.body;
    const avg = ((+quality_score + +speed_score + +service_score) / 3).toFixed(2);
    const ref = db.collection('evaluations').doc();
    await ref.set({ id:ref.id, request_id, evaluator_id:String(req.user.id), quality_score, speed_score, service_score, avg_score:avg, comment, created_at:Timestamp.now() });
    res.status(201).json({ message:'บันทึกผลประเมินสำเร็จ' });
  } catch(e){ res.status(500).json({error:e.message}); }
});

/* ====== DASHBOARD ====== */
const dashRouter = express.Router();
dashRouter.get('/', authenticate, authorize('manager','admin'), async (req, res) => {
  try {
    const snap = await db.collection('repair_requests').get();
    const reqs = snap.docs.map(d=>d.data());
    const total = {
      total: reqs.length,
      pending: reqs.filter(r=>r.status==='รอดำเนินการ').length,
      in_progress: reqs.filter(r=>r.status==='กำลังดำเนินการ').length,
      review: reqs.filter(r=>r.status==='รอตรวจสอบ').length,
      done: reqs.filter(r=>r.status==='เสร็จสมบูรณ์').length,
      emergency: reqs.filter(r=>r.urgency==='ฉุกเฉิน' && r.status!=='เสร็จสมบูรณ์').length,
      overdue: reqs.filter(r=>r.sla_deadline && r.sla_deadline.toMillis()<Date.now() && r.status!=='เสร็จสมบูรณ์').length
    };
    const catMap = {}; reqs.forEach(r => { catMap[r.category] = (catMap[r.category]||0)+1; });
    const by_category = Object.entries(catMap).map(([category, count]) => ({category, count}));
    
    // Very dummy summary
    res.json({ total, by_category, by_status: [], monthly: [], tech_perf: [], avg_sla: {avg_hours:0}, satisfaction: {avg:5.0, count:1} });
  } catch(e){ res.status(500).json({error:e.message}); }
});

/* ====== NOTIFICATIONS ====== */
const notifRouter = express.Router();
notifRouter.get('/', authenticate, async (req, res) => {
  try {
    const snap = await db.collection('notifications').where('user_id', '==', String(req.user.id)).get();
    let items = snap.docs.map(d=>({id: d.id, ...d.data()}));
    items.sort((a,b) => (b.created_at?.toMillis()||0) - (a.created_at?.toMillis()||0));
    items.forEach(i => { if(i.created_at instanceof Timestamp) i.created_at = i.created_at.toDate().toISOString(); });
    const unread = items.filter(n=>!n.is_read).length;
    res.json({ items, unread });
  } catch(e){ res.status(500).json({error:e.message}); }
});
notifRouter.patch('/read-all', authenticate, async (req, res) => {
  try {
    const snap = await db.collection('notifications').where('user_id', '==', String(req.user.id)).where('is_read', '==', 0).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.update(doc.ref, { is_read: 1 }));
    await batch.commit();
    res.json({ message:'อ่านทั้งหมดแล้ว' });
  } catch(e){ res.status(500).json({error:e.message}); }
});
notifRouter.patch('/:id/read', authenticate, async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({ is_read: 1 });
    res.json({ message:'ok' });
  } catch(e) { res.status(500).json({error:e.message}); }
});

/* ====== LOCATIONS (stub) ====== */
const locationRouter = express.Router();
locationRouter.get('/', (req,res) => res.json({buildings:[], locations:[], grouped:[]}));

/* ====== REPORTS (SRS 2.8) ====== */
const reportRouter = express.Router();

// Full request list for export
reportRouter.get('/requests', authenticate, authorize('manager','admin'), async (req, res) => {
  try {
    const [rSnap, uSnap] = await Promise.all([
      db.collection('repair_requests').orderBy('created_at','desc').get(),
      db.collection('users').get()
    ]);
    const userMap = {};
    uSnap.docs.forEach(d => { userMap[d.id] = d.data().name || d.data().email; });
    const rows = rSnap.docs.map(d => {
      const r = d.data();
      if(r.created_at?.toDate) r.created_at = r.created_at.toDate().toISOString();
      if(r.updated_at?.toDate) r.updated_at = r.updated_at.toDate().toISOString();
      if(r.sla_deadline?.toDate) r.sla_deadline = r.sla_deadline.toDate().toISOString();
      if(r.completed_at?.toDate) r.completed_at = r.completed_at.toDate().toISOString();
      return { ...r, id: d.id,
        requester_name: userMap[r.requester_id] || r.requester_name || '–',
        assigned_to_name: r.assigned_to ? (userMap[r.assigned_to] || '–') : '–',
      };
    });
    res.json({ rows, total: rows.length });
  } catch(e){ res.status(500).json({error:e.message}); }
});

// Aggregated stats for the reports dashboard
reportRouter.get('/summary', authenticate, authorize('manager','admin'), async (req, res) => {
  try {
    const [rSnap, uSnap, matSnap, evalSnap] = await Promise.all([
      db.collection('repair_requests').get(),
      db.collection('users').get(),
      db.collection('materials').get(),
      db.collection('evaluations').get()
    ]);

    const reqs  = rSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const mats  = matSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const evals = evalSnap.docs.map(d => d.data());
    const techMap = {};
    uSnap.docs.forEach(d => {
      const u = d.data();
      if(u.role === 'technician') techMap[d.id] = u.name || u.email;
    });

    // ── 1. Repair stats by category ──
    const catMap = {};
    reqs.forEach(r => {
      const c = r.category || 'ไม่ระบุ';
      catMap[c] = catMap[c] || { count:0, done:0, cost:0 };
      catMap[c].count++;
      if(r.status === 'เสร็จสมบูรณ์') catMap[c].done++;
      catMap[c].cost += Number(r.repair_cost || 0);
    });
    const by_category = Object.entries(catMap)
      .map(([category, v]) => ({ category, ...v, success_rate: v.count ? Math.round(v.done/v.count*100) : 0 }))
      .sort((a,b) => b.count - a.count);

    // ── 2. Avg resolution time (hours) for completed tickets ──
    let totalHours = 0, resolvedCount = 0;
    reqs.forEach(r => {
      if(r.status === 'เสร็จสมบูรณ์' && r.created_at && r.updated_at) {
        const start = r.created_at.toMillis ? r.created_at.toMillis() : new Date(r.created_at).getTime();
        const end   = r.updated_at.toMillis ? r.updated_at.toMillis() : new Date(r.updated_at).getTime();
        const hrs   = (end - start) / 3600000;
        if(hrs >= 0 && hrs < 8760) { totalHours += hrs; resolvedCount++; }
      }
    });
    const avg_resolution_hours = resolvedCount ? +(totalHours / resolvedCount).toFixed(1) : 0;

    // ── 3. Total cost ──
    const total_cost = reqs.reduce((s,r) => s + Number(r.repair_cost||0), 0);

    // ── 4. Success rate ──
    const done_count = reqs.filter(r => r.status === 'เสร็จสมบูรณ์').length;
    const success_rate = reqs.length ? Math.round(done_count/reqs.length*100) : 0;

    // ── 5. Monthly trend (last 7 months) ──
    const monthMap = {};
    reqs.forEach(r => {
      const ts = r.created_at?.toDate ? r.created_at.toDate() : new Date(r.created_at);
      if(isNaN(ts)) return;
      const key = `${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}`;
      monthMap[key] = monthMap[key] || { total:0, done:0, cost:0 };
      monthMap[key].total++;
      if(r.status === 'เสร็จสมบูรณ์') monthMap[key].done++;
      monthMap[key].cost += Number(r.repair_cost||0);
    });
    const monthly = Object.entries(monthMap)
      .sort(([a],[b]) => a.localeCompare(b))
      .slice(-7)
      .map(([month, v]) => ({ month, ...v }));

    // ── 6. Hotspot locations ──
    const locMap = {};
    reqs.forEach(r => {
      const loc = r.location || 'ไม่ระบุสถานที่';
      locMap[loc] = (locMap[loc]||0) + 1;
    });
    const hotspots = Object.entries(locMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 10);

    // ── 7. Tech performance ──
    const techPerf = {};
    reqs.forEach(r => {
      const tid = r.assigned_to || r.assigned_tech_id;
      if(!tid) return;
      techPerf[tid] = techPerf[tid] || { name: techMap[tid]||tid, total:0, done:0, in_progress:0, cost:0 };
      techPerf[tid].total++;
      if(r.status === 'เสร็จสมบูรณ์') techPerf[tid].done++;
      if(r.status === 'กำลังดำเนินการ') techPerf[tid].in_progress++;
      techPerf[tid].cost += Number(r.repair_cost||0);
    });
    const evalByTech = {};
    evals.forEach(e => {
      // match eval to request to get tech
      const req = reqs.find(r => r.id === e.request_id);
      const tid = req?.assigned_to || req?.assigned_tech_id;
      if(!tid) return;
      evalByTech[tid] = evalByTech[tid] || { sum:0, cnt:0 };
      evalByTech[tid].sum += Number(e.avg_score||0);
      evalByTech[tid].cnt++;
    });
    const tech_performance = Object.entries(techPerf).map(([tid, t]) => ({
      ...t,
      avg_score: evalByTech[tid] ? +(evalByTech[tid].sum/evalByTech[tid].cnt).toFixed(1) : 0,
      success_rate: t.total ? Math.round(t.done/t.total*100) : 0
    })).sort((a,b) => b.total - a.total);

    // ── 8. Satisfaction breakdown ──
    const satisfaction = {
      avg: evals.length ? +(evals.reduce((s,e)=>s+Number(e.avg_score||0),0)/evals.length).toFixed(1) : 0,
      quality: evals.length ? +(evals.reduce((s,e)=>s+Number(e.quality_score||0),0)/evals.length).toFixed(1) : 0,
      speed:   evals.length ? +(evals.reduce((s,e)=>s+Number(e.speed_score||0),0)/evals.length).toFixed(1) : 0,
      service: evals.length ? +(evals.reduce((s,e)=>s+Number(e.service_score||0),0)/evals.length).toFixed(1) : 0,
      count: evals.length
    };

    // ── 9. Material stats ──
    const total_material_value = mats.reduce((s,m)=>s+(m.quantity||0)*(m.unit_price||0),0);
    const low_stock = mats.filter(m=>(m.quantity||0)<=(m.reorder_point||5));
    // Most used: sort by (reorder_point - quantity) as a proxy for usage
    const mat_most_used = [...mats]
      .sort((a,b) => ((a.quantity||0)-(a.reorder_point||5)) - ((b.quantity||0)-(b.reorder_point||5)))
      .slice(0,5)
      .map(m => ({ name:m.name, code:m.code, quantity:m.quantity||0, reorder_point:m.reorder_point||5, unit:m.unit||'ชิ้น' }));

    // Degraded (very low, < 10% of reorder_point OR quantity=0)
    const mat_degraded = mats
      .filter(m => (m.quantity||0) === 0 || (m.reorder_point > 0 && (m.quantity||0) < m.reorder_point * 0.5))
      .map(m => ({ name:m.name, code:m.code, quantity:m.quantity||0, reorder_point:m.reorder_point||5, unit:m.unit||'ชิ้น', unit_price:m.unit_price||0 }));

    res.json({
      totals: {
        total: reqs.length, done: done_count, pending: reqs.filter(r=>r.status==='รอดำเนินการ').length,
        in_progress: reqs.filter(r=>r.status==='กำลังดำเนินการ').length, success_rate, total_cost,
        avg_resolution_hours
      },
      by_category, monthly, hotspots, tech_performance, satisfaction,
      materials: { total_value: total_material_value, items: mats.length, low_stock: low_stock.length, low_stock_items: low_stock, mat_most_used, mat_degraded }
    });
  } catch(e){ res.status(500).json({error:e.message}); }
});

module.exports = { materialRouter, userRouter, evalRouter, dashRouter, notifRouter, locationRouter, reportRouter };