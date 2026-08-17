"use client";

import { useEffect, useState } from "react";
import { getTurma, getAluno, type Aluno } from "../service/api";

export default function Turma() {
  const [turma, setTurma] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [id, setId] = useState(1);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState("todos");

  async function carregar() {
    try {
      setCarregando(true);
      setErro(null);
      setTurma(await getTurma());
    } catch {
      setErro("Falha ao carregar");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    getAluno(id).then(setAluno).catch(() => setAluno(null));
  }, [id]);

  const presentes = turma.filter((a) => a.presente);
  const ordenada = [...turma].sort((a, b) => b.nota - a.nota);
  const media = turma.length
    ? turma.reduce((t, a) => t + a.nota, 0) / turma.length
    : 0;

  const filtrada =
    cursoSelecionado === "todos"
      ? ordenada
      : ordenada.filter((a) => a.curso === cursoSelecionado);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
          <div>
            <h1 className="text-3xl font-bold">Minha Turma</h1>
            <p className="mt-1 text-sm text-blue-100">
              Acompanhe alunos, notas e presença.
            </p>
          </div>

          <button
            onClick={carregar}
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
          >
            ↻ Atualizar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {carregando ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Carregando...
          </div>
        ) : erro ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {erro}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["👥", "Alunos", turma.length],
                ["✓", "Presentes", presentes.length],
                ["★", "Média", media.toFixed(2)],
              ].map(([icon, titulo, valor]) => (
                <div
                  key={titulo}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{titulo}</p>
                    <span className="text-xl">{icon}</span>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-slate-800">{valor}</p>
                </div>
              ))}
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <p className="text-xs font-bold uppercase text-blue-600">
                  Aluno selecionado
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow">
                      {aluno?.nome?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800">
                        {aluno?.nome || "-"}
                      </h2>
                      <p className="text-sm text-slate-500">ID: {id}</p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <p>
                      Curso <b>{aluno?.curso || "-"}</b>
                    </p>
                    <p>
                      Nota <b className="text-blue-600">{aluno?.nota ?? "-"}</b>
                    </p>
                    <p
                      className={
                        aluno?.presente
                          ? "font-semibold text-green-600"
                          : "font-semibold text-red-500"
                      }
                    >
                      {aluno?.presente ? "● Presente" : "● Ausente"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setId(n)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        id === n
                          ? "bg-blue-600 text-white shadow"
                          : "bg-white text-slate-600 hover:bg-blue-100"
                      }`}
                    >
                      Aluno {n}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 className="font-bold text-slate-800">Alunos da turma</h2>
                  <p className="text-sm text-slate-500">
                    Ranking por desempenho
                  </p>
                </div>

                <select
                  value={cursoSelecionado}
                  onChange={(e) => setCursoSelecionado(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="Front-end">Front-end</option>
                  <option value="Back-end">Back-end</option>
                </select>
              </div>

              <div className="divide-y">
                {filtrada.map((a, i) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-5 transition hover:bg-blue-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-sm font-bold text-slate-400">
                        {i + 1}
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {a.nome[0].toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">{a.nome}</h3>
                        <p className="text-sm text-slate-500">{a.curso}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <b className="text-slate-700">{a.nota}</b>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          a.presente
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {a.presente ? "Presente" : "Ausente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}