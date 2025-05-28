let pacientes = [];

document.getElementById('formulario').addEventListener('submit', cadastrarPaciente);
document.getElementById('busca').addEventListener('input', () => listarPacientes());

function cadastrarPaciente(evento) {
  evento.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const nascimento = document.getElementById('nascimento').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
  const sintomas = document.getElementById('sintomas').value.trim();
  const diagnostico = document.getElementById('diagnostico').value.trim();

  if (!nome || !nascimento || !cpf || !sexo || !sintomas || !diagnostico) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
    alert("A data deve estar no formato AAAA-MM-DD.");
    return;
  }

  const pacienteExistente = pacientes.find(p => p.cpf === cpf);
  if (pacienteExistente) {
    alert("CPF já cadastrado.");
    return;
  }

  const paciente = { nome, nascimento, cpf, sexo, sintomas, diagnostico };
  pacientes.push(paciente);

  evento.target.reset();
  listarPacientes();
}

function calcularIdade(dataNasc) {
  const nascimento = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function listarPacientes() {
  const corpoTabela = document.getElementById('tabela-pacientes');
  corpoTabela.innerHTML = "";
  const filtro = document.getElementById('busca').value.toLowerCase();

  pacientes
    .filter(p => p.nome.toLowerCase().includes(filtro))
    .forEach(paciente => {
      const linha = document.createElement('tr');

      const idade = calcularIdade(paciente.nascimento);

      linha.innerHTML = `
        <td>${paciente.nome}</td>
        <td>${idade}</td>
        <td>${paciente.cpf}</td>
        <td>
          <button onclick="mostrarDetalhes('${paciente.cpf}')">Detalhes</button>
          <button onclick="prepararEdicao('${paciente.cpf}')">Editar</button>
        </td>
      `;

      corpoTabela.appendChild(linha);
    });
}

function mostrarDetalhes(cpf) {
  const paciente = pacientes.find(p => p.cpf === cpf);
  if (!paciente) return;

  const detalhes = `
- Detalhes do Paciente -

Nome: ${paciente.nome}
CPF: ${paciente.cpf}
Nascimento: ${paciente.nascimento} (Idade: ${calcularIdade(paciente.nascimento)} anos)
Sexo: ${paciente.sexo}

Sintomas:
${paciente.sintomas}

Diagnóstico:
${paciente.diagnostico}
  `;

  alert(detalhes);
}

function prepararEdicao(cpf) {
  const paciente = pacientes.find(p => p.cpf === cpf);
  if (!paciente) return;

  document.getElementById('nome').value = paciente.nome;
  document.getElementById('nascimento').value = paciente.nascimento;
  document.getElementById('cpf').value = paciente.cpf;
  document.querySelector(`input[name="sexo"][value="${paciente.sexo}"]`).checked = true;
  document.getElementById('sintomas').value = paciente.sintomas;
  document.getElementById('diagnostico').value = paciente.diagnostico;

  pacientes = pacientes.filter(p => p.cpf !== cpf);
}