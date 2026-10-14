import { WindowFrame } from '@/components/ui/window-frame';

// Snippet decorativo del board 01 · Inicio (Code card). Repite datos del
// resumen, así que queda oculto para lectores de pantalla.
const entries: [key: string, value: string | string[]][] = [
  ['role', 'Full-Stack Developer'],
  ['frontend', ['React', 'Next.js', 'TS']],
  ['backend', ['Node.js', 'NestJS', 'Laravel']],
  ['data', ['PostgreSQL', 'MongoDB']],
  ['domain', ['Banca', 'Cripto', 'Crédito']],
  ['based', 'Venezuela · remoto'],
];

// const, entries, coffee, cierre y la línea del cursor.
const lineCount = entries.length + 4;

const Str = ({ children }: { children: string }) => (
  <span className='text-code-string'>&quot;{children}&quot;</span>
);

const Value = ({ value }: { value: string | string[] }) =>
  typeof value === 'string' ? (
    <Str>{value}</Str>
  ) : (
    <>
      [
      {value.map((item, i) => (
        <span key={item}>
          {i > 0 && ', '}
          <Str>{item}</Str>
        </span>
      ))}
      ]
    </>
  );

export const CodeCard = () => (
  // Ancho del board (500 px) también cuando va apilada, para no estirarse.
  <WindowFrame title='jesus.ts' className='w-full max-w-125 xl:h-91'>
    <div
      aria-hidden
      className='flex gap-[13px] overflow-x-auto p-5 font-mono text-code text-terminal-text'
    >
      <ol className='text-code-line-number select-none'>
        {Array.from({ length: lineCount }, (_, i) => (
          <li key={i}>{i + 1}</li>
        ))}
      </ol>
      <ol className='whitespace-pre'>
        <li>
          <span className='text-accent-text'>const</span> jesus = {'{'}
        </li>
        {entries.map(([key, value]) => (
          <li key={key}>
            <span className='text-terminal-key'>{`  ${key}:`}</span>{' '}
            <Value value={value} />,
          </li>
        ))}
        <li>
          <span className='text-terminal-key'>{'  coffee:'}</span>{' '}
          <span className='text-foreground'>Infinity</span>,
        </li>
        <li className='text-foreground'>{'};'}</li>
        <li>
          <span className='inline-block h-5 w-[9px] animate-blink bg-accent-text align-middle motion-reduce:animate-none' />
        </li>
      </ol>
    </div>
  </WindowFrame>
);
