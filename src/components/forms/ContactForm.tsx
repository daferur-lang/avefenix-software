import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name:     z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email:    z.string().email('Introduce un email válido'),
  company:  z.string().optional(),
  service:  z.enum(['web', 'software', 'automatizacion', 'seo', 'otro'], {
    errorMap: () => ({ message: 'Selecciona un servicio' }),
  }),
  message:  z.string().min(20, 'El mensaje debe tener al menos 20 caracteres').max(1000),
  honeypot: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

type Status = 'idle' | 'loading' | 'success' | 'error';

const SERVICES = [
  { value: 'web',            label: 'Desarrollo Web' },
  { value: 'software',       label: 'Software a Medida' },
  { value: 'automatizacion', label: 'Automatizaciones' },
  { value: 'seo',            label: 'Auditoría SEO' },
  { value: 'otro',           label: 'Otro' },
] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus('loading');
    // URL de la Firebase Function — reemplaza con tu URL real tras el deploy
    const FUNCTION_URL =
      import.meta.env.PUBLIC_CONTACT_FUNCTION_URL ??
      'https://europe-west1-TU_PROJECT_ID.cloudfunctions.net/contact';

    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error del servidor');

      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '12px',
        padding: '2.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#22C55E',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', color: '#F5F4F2' }}>
          ¡Mensaje enviado!
        </h3>
        <p style={{ fontFamily: 'Source Sans 3, sans-serif', color: '#A8A29E', fontSize: '0.95rem' }}>
          Te respondemos en menos de 24 horas. Revisa también tu carpeta de spam.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{
            marginTop: '0.5rem', padding: '0.5rem 1.25rem',
            background: 'transparent', border: '1px solid #292524',
            borderRadius: '6px', color: '#A8A29E',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Honeypot — anti-spam */}
      <input {...register('honeypot')} type="text" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

      {/* Nombre */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">Nombre *</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`form-input ${errors.name ? 'form-input--error' : ''}`}
          placeholder="Tu nombre completo"
          autoComplete="name"
        />
        {errors.name && <span className="form-error" role="alert">{errors.name.message}</span>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email *</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          placeholder="tu@empresa.com"
          autoComplete="email"
        />
        {errors.email && <span className="form-error" role="alert">{errors.email.message}</span>}
      </div>

      {/* Empresa */}
      <div className="form-group">
        <label htmlFor="company" className="form-label">Empresa <span className="optional">(opcional)</span></label>
        <input
          id="company"
          type="text"
          {...register('company')}
          className="form-input"
          placeholder="Nombre de tu empresa"
          autoComplete="organization"
        />
      </div>

      {/* Servicio */}
      <div className="form-group">
        <label htmlFor="service" className="form-label">¿Qué necesitas? *</label>
        <select
          id="service"
          {...register('service')}
          className={`form-input form-select ${errors.service ? 'form-input--error' : ''}`}
        >
          <option value="">Selecciona un servicio</option>
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {errors.service && <span className="form-error" role="alert">{errors.service.message}</span>}
      </div>

      {/* Mensaje */}
      <div className="form-group">
        <label htmlFor="message" className="form-label">Cuéntanos tu proyecto *</label>
        <textarea
          id="message"
          {...register('message')}
          className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
          placeholder="Describe qué quieres construir, qué problema tienes o qué resultado buscas..."
          rows={5}
        />
        {errors.message && <span className="form-error" role="alert">{errors.message.message}</span>}
      </div>

      {/* Error global */}
      {status === 'error' && (
        <div className="form-error-global" role="alert">
          Algo salió mal. Prueba de nuevo o escríbenos directamente a daferur@gmail.com
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || status === 'loading'}
        className="form-submit"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensaje →'}
      </button>

      <style>{`
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }

        .form-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #A8A29E;
        }

        .optional { font-weight: 400; color: #57534E; }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #0E0D0C;
          border: 1px solid #292524;
          border-radius: 8px;
          color: #F5F4F2;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.95rem;
          line-height: 1.5;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
          -webkit-appearance: none;
        }

        .form-input::placeholder { color: #57534E; }

        .form-input:focus {
          border-color: #EA580C;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
        }

        .form-input--error { border-color: #EF4444 !important; }

        .form-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2357534E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .form-select option { background: #1C1917; }

        .form-textarea { resize: vertical; min-height: 120px; }

        .form-error {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          color: #EF4444;
        }

        .form-error-global {
          padding: 0.875rem 1rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          color: #EF4444;
        }

        .form-submit {
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #9A3412 0%, #EA580C 40%, #D97706 70%, #FCD34D 100%);
          color: #050505;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s ease, box-shadow 0.2s ease;
          margin-top: 0.5rem;
        }

        .form-submit:hover:not(:disabled) {
          opacity: 0.9;
          box-shadow: 0 0 30px rgba(234, 88, 12, 0.35);
        }

        .form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
