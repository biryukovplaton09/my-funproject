# Чтение весовой матрицы из файла
with open("input.txt", "r") as file:
    matrix = [list(map(int, line.split())) for line in file if line.strip()]

n = len(matrix)  # Количество вершин в графе
selected = [False] * n  # Список посещённых вершин
selected[0] = True  # Начинаем построение с первой вершины (индекс 0)

mst_edges = []  # Список рёбер минимального остовного дерева
total_weight = 0  # Общий вес дерева

# В остовном дереве из n вершин всегда (n - 1) ребро
for _ in range(n - 1):
    min_weight = float('inf')
    u = -1
    v = -1

    # Ищем ребро с минимальным весом, соединяющее посещённую вершину с непосещённой
    for i in range(n):
        if selected[i]:
            for j in range(n):
                if not selected[j] and matrix[i][j] > 0:
                    if matrix[i][j] < min_weight:
                        min_weight = matrix[i][j]
                        u = i
                        v = j

    # Если такое ребро найдено, добавляем его в дерево
    if u != -1 and v != -1:
        selected[v] = True
        # Прибавляем 1 к индексам для привычной нумерации вершин с 1
        mst_edges.append((u + 1, v + 1, min_weight))
        total_weight += min_weight

# Вывод результата
print("Рёбра минимального остовного дерева:")
for u, v, weight in mst_edges:
    print(f"Вершина {u} — Вершина {v} (вес: {weight})")

print(f"Общий вес минимального остовного дерева: {total_weight}")
