export const submitPreferences = async (req, res) => {
  const supabase = req.supabase;   // 🔥 auth-bound client

  try {
    const staffId = req.user.id;
    const { preferences } = req.body;

    if (!preferences || preferences.length === 0) {
      return res.status(400).json({ error: 'Preferences required' });
    }

    // Check if already submitted
    const { count, error: countError } = await supabase
      .from('Preferences')
      .select('*', { count: 'exact', head: true })
      .eq('staff_id', staffId);

    if (countError) throw countError;

    if (count > 0) {
      return res.status(400).json({
        error: 'Preferences already submitted. Editing not allowed.'
      });
    }

    // Get faculty
    const { data: faculty, error: facultyError } = await supabase
      .from('Faculty')
      .select('is_senior, max_load_clh')
      .eq('staff_id', staffId)
      .single();

    if (facultyError) throw facultyError;
    if (!faculty) throw new Error('Faculty not found');

    // Get courses
    const courseIds = preferences.map(p => p.course_id);

    const { data: courses, error: courseError } = await supabase
      .from('Courses')
      .select('course_id, calculated_clh, is_core, is_lab_associated')
      .in('course_id', courseIds);

    if (courseError) throw courseError;

    if (!courses || courses.length === 0) {
      throw new Error('No courses found for given IDs');
    }

    // ===== VALIDATIONS =====
    if (preferences.length > 3) {
      throw new Error('Max 3 preferences allowed');
    }

    const ranks = preferences.map(p => p.preference_rank);
    if (new Set(ranks).size !== ranks.length) {
      throw new Error('Duplicate preference ranks');
    }

    let totalCLH = 0;
    let hasLab = false;
    let hasCore = false;
    const warnings = [];

    for (const c of courses) {
      totalCLH += c.calculated_clh;
      if (c.is_lab_associated) hasLab = true;
      if (c.is_core) hasCore = true;
    }

    if (totalCLH > faculty.max_load_clh) {
      throw new Error('CLH exceeds limit');
    }

    if (faculty.is_senior && hasLab && courses.length > 1) {
      throw new Error('Senior faculty can select only one lab course');
    }

    if (!hasCore) warnings.push('Elective selected without core');
    if (!faculty.is_senior && !hasCore) {
      warnings.push('Junior faculty advised to select core courses');
    }

    // ===== INSERT =====
    const rows = preferences.map(p => ({
      staff_id: staffId,
      course_id: p.course_id,
      preference_rank: p.preference_rank
    }));

    const { error: insertError } = await supabase
      .from('Preferences')
      .insert(rows);

    if (insertError) throw insertError;

    return res.status(201).json({
      success: true,
      warnings
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
export const getMyPreferences = async (req, res) => {
  const supabase = req.supabase;

  try {
    const staffId = req.user.id;

    const { data, error } = await supabase
      .from('Preferences')
      .select('*')
      .eq('staff_id', staffId);

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
