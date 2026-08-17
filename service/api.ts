export type Aluno = {
  id: number;
  nome: string;
  curso: string;
  nota: number;
  presente: boolean;
};

function formatarAluno(item: any): Aluno {
  return {
    id: Number(item.id),
    nome: String(item.nome).replace(/\s+/g, " ").trim(),
    curso: String(item.curso),
    nota: Number(item.nota),
    presente: Boolean(item.presente),
  };
}

export async function getTurma(): Promise<Aluno[]> {
  const res = await fetch("https://prof.giango.com.br/api/turma");

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Resposta da API em formato inesperado");
  }

  return data.map(formatarAluno);
}

export async function getAluno(id: number): Promise<Aluno> {
  const res = await fetch(`https://prof.giango.com.br/api/turma/${id}`);

  if (!res.ok) {
    throw new Error(`Erro ao buscar aluno: ${res.status}`);
  }

  const data = await res.json();

  return formatarAluno(data);
}