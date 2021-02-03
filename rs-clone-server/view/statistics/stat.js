const container = document.querySelector('.statistics-data');

function getDataContainer(data = '') {
  const dataContainer = document.createElement('div');
  dataContainer.classList.add('d-td');
  dataContainer.innerText = data;
  return dataContainer;
}

function getContainerWrapper(cssClass = '') {
  const containerWrapper = document.createElement('div');
  if (cssClass) {
    containerWrapper.classList.add('d-tr', cssClass);
  } else {
    containerWrapper.classList.add('d-tr');
  }
  return containerWrapper;
}

function getProgressContainer(percents) {
  const progress = document.createElement('div');
  progress.classList.add('d-td');
  const progressGraph = document.createElement('div');
  progressGraph.style = `width:${percents}%;background:red;height:20px;`;
  progress.append(progressGraph);
  return progress;
}

function getTotalSum(jsonData) {
  let total = 0;
  jsonData.forEach((element) => {
    total += Number(element.Score) || 0;
  });
  return total;
}

function getSortedData(jsonData) {
  jsonData.sort((a, b) => (Number(a.Score || 0) > Number(b.Score || 0) ? -1 : 1));
}

function getRoundedScore(score) {
  return Math.trunc((score / 100)) / 10;
}

function getRoundedPercent(score, total) {
  const fullNumber = (100 * Number(score)) / total;
  return Math.trunc((fullNumber * 100)) / 100;
}

function makeStatisticsFooter(total) {
  const footerWrapper = getContainerWrapper('td-footer');
  footerWrapper.appendChild(getDataContainer('total'));
  footerWrapper.appendChild(getDataContainer(getRoundedScore(total)));
  footerWrapper.appendChild(getDataContainer('100'));
  footerWrapper.appendChild(getDataContainer());

  container.appendChild(footerWrapper);
}

async function makeStatisticsContent(jsonData) {
  let wrapper;
  let score;
  let percent;
  const total = getTotalSum(jsonData) || 1;
  getSortedData(jsonData);
  jsonData.forEach((element) => {
    score = getRoundedScore(Number(element.Score) || 0);
    percent = getRoundedPercent(Number(element.Score) || 0, total);
    wrapper = getContainerWrapper();
    wrapper.appendChild(getDataContainer(element['User Name']));
    wrapper.appendChild(getDataContainer(score));
    wrapper.appendChild(getDataContainer(percent));
    wrapper.appendChild(getProgressContainer(percent));

    container.appendChild(wrapper);
  });
  makeStatisticsFooter(total);
}

function getStat() {
  async function getStatData(url) {
    const response = await fetch(url);
    return response.json();
  }
  getStatData('https://rs-clone-server.herokuapp.com/players/').then((data) => makeStatisticsContent(data));
}
getStat();
