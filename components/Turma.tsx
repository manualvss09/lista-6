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
  const timer = setTimeout(() => {
    carregar();
  }, 0);

  return () => clearTimeout(timer);
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
    <main className="min-h-screen bg-[#f3f3f3] text-slate-900">

      {/* Cabeçalho */}
      <header className="bg-[#131921] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#ff9900]">
              Painel da turma
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              Minha Turma
            </h1>

            <p className="mt-1 text-sm text-slate-300">
              Acompanhe alunos, notas e presença.
            </p>
          </div>

          <button
            onClick={carregar}
            className="rounded-lg border border-slate-600 bg-[#232f3e] px-4 py-2 text-sm font-semibold transition hover:border-[#ff9900] hover:text-[#ff9900]"
          >
            ↻ Atualizar
          </button>

        </div>

        <div className="h-1 bg-[#ff9900]" />
      </header>


      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">

        {carregando ? (

          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#ff9900]" />

            <p className="font-medium text-slate-700">
              Carregando...
            </p>
          </div>

        ) : erro ? (

          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            <p className="font-semibold">{erro}</p>
          </div>

        ) : (

          <>

            {/* Resumo */}
            <div className="grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Alunos
                  </p>

                  <span className="text-xl">👥</span>
                </div>

                <p className="mt-2 text-3xl font-bold text-[#131921]">
                  {turma.length}
                </p>
              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Presentes
                  </p>

                  <span className="text-xl">✓</span>
                </div>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {presentes.length}
                </p>
              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Média
                  </p>

                  <span className="text-xl text-[#ff9900]">★</span>
                </div>

                <p className="mt-2 text-3xl font-bold text-[#131921]">
                  {media.toFixed(2)}
                </p>
              </div>

            </div>


            {/* Aluno selecionado */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 bg-[#fafafa] p-6">

                <p className="text-xs font-bold uppercase tracking-wider text-[#ff9900]">
                  Consulta
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#232f3e] text-lg font-bold text-white">
                      {aluno?.nome?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800">
                        {aluno?.nome || "-"}
                      </h2>

                      <p className="text-sm text-slate-500">
                        ID: {id}
                      </p>
                    </div>

                  </div>


                  <div className="flex flex-wrap gap-5 text-sm">

                    <p className="text-slate-500">
                      Curso{" "}
                      <b className="text-slate-800">
                        {aluno?.curso || "-"}
                      </b>
                    </p>

                    <p className="text-slate-500">
                      Nota{" "}
                      <b className="text-[#ff9900]">
                        {aluno?.nota ?? "-"}
                      </b>
                    </p>

                    <p
                      className={
                        aluno?.presente
                          ? "font-semibold text-emerald-600"
                          : "font-semibold text-red-500"
                      }
                    >
                      {aluno?.presente
                        ? "● Presente"
                        : "● Ausente"}
                    </p>

                  </div>

                </div>


                {/* Seleção de aluno */}
                <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

                  {turma.map((a) => (

                    <button
                      key={a.id}
                      onClick={() => setId(a.id)}
                      className={`min-w-fit rounded-lg px-4 py-2 text-sm font-medium transition ${
                        id === a.id
                          ? "bg-[#ff9900] text-white shadow-sm"
                          : "bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                      }`}
                    >
                      {a.nome}
                    </button>

                  ))}

                </div>

              </div>

            </section>


            {/* Lista */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-200 p-5">

                <div>
                  <h2 className="font-bold text-[#131921]">
                    Alunos da turma
                  </h2>

                  <p className="text-sm text-slate-500">
                    Ranking por desempenho
                  </p>
                </div>


                <select
                  value={cursoSelecionado}
                  onChange={(e) => setCursoSelecionado(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                >
                  <option value="todos">
                    Todos
                  </option>

                  <option value="Front-end">
                    Front-end
                  </option>

                  <option value="Back-end">
                    Back-end
                  </option>
                </select>

              </div>


              <div className="divide-y divide-slate-100">

                {filtrada.map((a, i) => (

                  <div
                    key={a.id}
                    className="flex items-center justify-between p-5 transition hover:bg-orange-50/40"
                  >

                    <div className="flex items-center gap-3">

                      <span className="w-5 text-sm font-bold text-slate-400">
                        {i + 1}
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-700">
                        {a.nome[0].toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {a.nome}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {a.curso}
                        </p>
                      </div>

                    </div>


                    <div className="flex items-center gap-5">

                      <b className="text-slate-700">
                        {a.nota}
                      </b>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          a.presente
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {a.presente
                          ? "Presente"
                          : "Ausente"}
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

