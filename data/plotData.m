load 'pdata.txt'
hold on
title('Probability of a map with a solution')
xlabel('p-value');
ylabel('Probability of a solution');
plot(pdata(:,1), pdata(:,2) / 1000)

%% plot dfs for Q4
load 'dfslength.txt'
hold on
title('DFS 100x100')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average Path Length');
plot(dfslength(:,1), dfslength(:,2))

%% plot bfs for Q4
load 'bfslength.txt'
hold on
title('BFS 100x100')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average Path Length');
plot(bfslength(:,1), bfslength(:,2))

%% plot A* Manhattan for Q4
load 'astarmanh.txt'
hold on
title('A* Manhattan 100x100')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average Path Length');
plot(astarmanh(:,1), astarmanh(:,2))

%% plot A* Eulidean for Q4
load 'astareuc.txt'
hold on
title('A* Euclidean 100x100')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average Path Length');
plot(astareuc(:,1), astareuc(:,2))

%% plot A* Man for Q6
load 'astarmanexpand.txt'
hold on
title('A* Manhattan 30x30')
xlabel('p-value');
xlim([0 0.4]);
ylabel('Average # of Nodes Expanded');
plot(astarmanexpand(:,1), astarmanexpand(:,2))

%% plot A* Euc for Q6
load 'astareucexpand.txt'
hold on
title('A* Euclidean 30x30')
xlabel('p-value');
xlim([0 0.4]);
ylabel('Average # of Nodes Expanded');
plot(astareucexpand(:,1), astareucexpand(:,2))


%% plot DFS for Q7
load 'dfsnodes.txt'
hold on
title('DFS 30x30')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average # of Nodes Expanded');
plot(dfsnodes(:,1), dfsnodes(:,2))

%% plot BFS for Q7
load 'bfsnodes.txt'
hold on
title('BFS 30x30')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average # of Nodes Expanded');
plot(bfsnodes(:,1), bfsnodes(:,2))

%% plot A* Max for Q8
load 'astarmaxnodes.txt'
hold on
title('A* Max Distance 30x30')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average # of Nodes Expanded');
plot(astarmaxnodes(:,1), astarmaxnodes(:,2))

%% plot A* Min for Q8
load 'asminexpand.txt'
hold on
title('A* Min Distance 30x30')
xlabel('p-value');
xlim([0 0.3]);
ylabel('Average # of Nodes Expanded');
plot(asminexpand(:,1), asminexpand(:,2))

%% plot A* Alpha for Q8
load 'astaralpha.txt'
x = astaralpha(:,1);
y = astaralpha(:,2);
z = astaralpha(:,3);
gx=0:0.01:0.3;
gy=0:0.1:1;
g=gridfit(x,y,z,gx,gy);
figure
colormap(hot(256));
surf(gx,gy,g);
camlight right;
lighting phong;
shading interp
line(x,y,z,'marker','.','markersize',4,'linestyle','none');
title('A* Alpha 30x30')
xlabel('p-value');
ylabel('alpha value');
zlabel('Average # of Nodes Expanded');

%% plot A* Beta for Q8
load 'astarbeta.txt'
x = astarbeta(:,1);
y = astarbeta(:,2);
z = astarbeta(:,3);
gx=0:0.01:0.3;
gy=1:0.1:2;
g=gridfit(x,y,z,gx,gy);
figure
colormap(hot(256));
surf(gx,gy,g);
camlight right;
lighting phong;
shading interp
line(x,y,z,'marker','.','markersize',4,'linestyle','none');
title('A* Beta 30x30')
xlabel('p-value');
ylabel('beta value');
zlabel('Average # of Nodes Expanded');