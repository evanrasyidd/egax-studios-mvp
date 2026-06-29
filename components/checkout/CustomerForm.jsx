'use client'
export default function CustomerForm({ data, onChange, errors }) {
  const f = (name, label, type='text', placeholder='', full=false) => ({ name, label, type, placeholder, full })
  const fields = [
    f('firstName','First Name','text','John'), f('lastName','Last Name','text','Doe'),
    f('email','Email','email','john@email.com',true), f('phone','Phone','tel','08xxxxxxxxxx',true),
    f('address','Address','text','Jl. Sudirman No. 1',true),
    f('city','City','text','Jakarta'), f('postalCode','Postal Code','text','12345'),
    f('province','Province','text','DKI Jakarta',true),
  ]
  return (
    <div>
      <h2 className="font-display text-[22px] tracking-widest text-text1 mb-5">Customer Info</h2>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({name,label,type,placeholder,full}) => (
          <div key={name} className={full ? 'col-span-2' : ''}>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text2 block mb-1.5">{label}</label>
            <input type={type} value={data[name]||''} onChange={e=>onChange(name,e.target.value)} placeholder={placeholder}
              className={`w-full bg-surface border text-text1 text-sm px-4 py-3 outline-none font-body placeholder:text-text2/40 focus:border-pink transition-colors ${errors?.[name]?'border-red-500':'border-border'}`}/>
            {errors?.[name] && <p className="text-[11px] text-red-400 mt-1">{errors[name]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
