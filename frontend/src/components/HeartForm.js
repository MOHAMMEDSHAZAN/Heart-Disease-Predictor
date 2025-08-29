import React, {useState} from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function HeartForm(){
  const [form, setForm] = useState({
    age: 63,
    sex: 'M',
    cp: 'typical angina',
    trestbps: 145,
    chol: 233,
    fbs: false,
    restecg: 'normal',
    thalch: 150,
    exang: false,
    oldpeak: 2.3,
    slope: 'flat',
    ca: 0,
    thal: 'fixed defect'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e){
    const {name, value, type, checked} = e.target;
    setForm(prev=>({
      ...prev,
      [name]: type==='checkbox' ? checked : (type==='number' ? Number(value) : value)
    }))
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch(`${API_URL}/predict`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(data);
    }catch(err){
      setResult({error:err.message});
    }finally{setLoading(false);}
  }

  return (
    <div className="card p-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-2">
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-2">
            <label>Sex</label>
            <select name="sex" value={form.sex} onChange={handleChange} className="form-control">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="col-md-3">
            <label>Chest Pain (cp)</label>
            <select name="cp" value={form.cp} onChange={handleChange} className="form-control">
              <option>typical angina</option>
              <option>atypical angina</option>
              <option>non-anginal</option>
              <option>asymptomatic</option>
            </select>
          </div>
          <div className="col-md-2">
            <label>Resting BP</label>
            <input type="number" name="trestbps" value={form.trestbps} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-3">
            <label>Cholesterol</label>
            <input type="number" name="chol" value={form.chol} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-3">
            <label>Fasting BS > 120?</label>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="fbs" checked={form.fbs} onChange={handleChange} />
              <label className="form-check-label">Yes</label>
            </div>
          </div>

          <div className="col-md-3">
            <label>Rest ECG</label>
            <select name="restecg" value={form.restecg} onChange={handleChange} className="form-control">
              <option>normal</option>
              <option>ST-T wave abnormality</option>
              <option>left ventricular hypertrophy</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Max Heart Rate</label>
            <input type="number" name="thalch" value={form.thalch} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-2">
            <label>Exercise induced angina</label>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="exang" checked={form.exang} onChange={handleChange} />
              <label className="form-check-label">Yes</label>
            </div>
          </div>

          <div className="col-md-2">
            <label>Oldpeak</label>
            <input type="number" step="0.1" name="oldpeak" value={form.oldpeak} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-2">
            <label>Slope</label>
            <select name="slope" value={form.slope} onChange={handleChange} className="form-control">
              <option>flat</option>
              <option>upsloping</option>
              <option>downsloping</option>
            </select>
          </div>

          <div className="col-md-2">
            <label>CA</label>
            <input type="number" name="ca" value={form.ca} onChange={handleChange} className="form-control" min="0" max="4" />
          </div>

          <div className="col-md-3">
            <label>Thal</label>
            <select name="thal" value={form.thal} onChange={handleChange} className="form-control">
              <option>normal</option>
              <option>fixed defect</option>
              <option>reversable defect</option>
            </select>
          </div>

          <div className="col-12 mt-3">
            <button className="btn btn-primary" disabled={loading}>Predict</button>
          </div>
        </div>
      </form>

      <div className="mt-4">
        {loading && <div>Loading...</div>}
        {result && result.error && <div className="alert alert-danger">{result.error}</div>}
        {result && !result.error && (
          <div className="alert alert-info">
            <strong>Prediction:</strong> {result.prediction} — {result.message}
            <br />
            <strong>Confidence:</strong> {(result.probability*100).toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
}
