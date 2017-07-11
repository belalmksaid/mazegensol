load 'pdata.txt'
hold on
title('Probability of a map with a solution')
xlabel('p-value');
ylabel('Probability of a solution');
plot(pdata(:,1), pdata(:,2) / 1000)