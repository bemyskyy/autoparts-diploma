import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { TreeNode, MessageService, MenuItem } from 'primeng/api';

import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ContextMenuModule,
    TooltipModule
  ],
  template: `
    <div class="space-y-6">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Категории</h1>
                <p class="text-gray-500 text-sm mt-1">Структура каталога товаров</p>
            </div>

            <button
                pButton
                label="Создать корневую категорию"
                icon="pi pi-plus"
                class="bg-blue-600 border-none hover:bg-blue-700 shadow-lg shadow-blue-600/30 px-5 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                (click)="openDialog(null)">
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6 min-h-[500px]">

            <div class="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm flex items-center gap-3">
                <i class="pi pi-info-circle text-lg"></i>
                <span>Нажмите <strong>правую кнопку мыши</strong> на категории, чтобы добавить подкатегорию, изменить или удалить её.</span>
            </div>

            <p-tree
                [value]="categories"
                selectionMode="single"
                [(selection)]="selectedNode"
                [contextMenu]="cm"
                styleClass="w-full border-none p-0 custom-tree"
                [filter]="true"
                filterPlaceholder="Поиск категории..."
                filterMode="lenient"
            >
                <ng-template let-node pTemplate="default">
                    <div class="flex items-center gap-2 py-1 w-full">
                        <i class="pi text-yellow-500" [ngClass]="node.expanded ? 'pi-folder-open' : 'pi-folder'"></i>
                        <span class="font-medium text-gray-700">{{ node.label }}</span>
                        <span *ngIf="node.children?.length" class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                            {{ node.children.length }}
                        </span>
                    </div>
                </ng-template>
            </p-tree>

            <p-contextMenu #cm [model]="menuItems" styleClass="custom-context-menu"></p-contextMenu>
        </div>

      <p-dialog
        [(visible)]="displayDialog"
        [header]="editMode ? 'Редактировать категорию' : 'Новая категория'"
        [modal]="true"
        [style]="{width: '450px'}"
        styleClass="p-fluid custom-dialog"
        [draggable]="false"
        [resizable]="false"
        [closeOnEscape]="true"
        [dismissableMask]="true"
      >
        <div class="flex flex-col gap-5 pt-2">

          <div class="field">
            <label class="font-bold text-gray-700 mb-1 block">Название категории</label>
            <input
                pInputText
                [(ngModel)]="categoryName"
                autofocus
                class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="Например: Двигатель"
            />
          </div>

          <div *ngIf="parentNode && !editMode" class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
             <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                 <i class="pi pi-folder-open text-yellow-500 text-xl"></i>
             </div>
             <div>
                 <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">Родитель</span>
                 <div class="font-bold text-gray-800">{{ parentNode.label }}</div>
             </div>
          </div>

        </div>

        <ng-template pTemplate="footer">
            <div class="flex justify-end gap-2 pt-4">
                <button
                    pButton
                    label="Отмена"
                    class="p-button-text p-button-secondary font-bold"
                    (click)="displayDialog = false">
                </button>
                <button
                    pButton
                    [label]="editMode ? 'Сохранить' : 'Создать'"
                    icon="pi pi-check"
                    class="bg-blue-600 border-none hover:bg-blue-700 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                    (click)="save()"
                    [disabled]="!categoryName">
                </button>
            </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    /* Стилизация дерева */
    :host ::ng-deep .custom-tree .p-treenode-content {
        padding: 0.5rem 0.5rem !important;
        border-radius: 0.75rem;
        margin-bottom: 2px;
        border: 1px solid transparent;
        transition: all 0.2s;
    }
    :host ::ng-deep .custom-tree .p-treenode-content:hover {
        background-color: #F3F4F6 !important;
        border-color: #E5E7EB;
    }
    :host ::ng-deep .custom-tree .p-treenode-content.p-highlight {
        background-color: #EFF6FF !important;
        border-color: #BFDBFE;
        color: #1D4ED8;
    }
    :host ::ng-deep .custom-tree .p-treenode-content.p-highlight .p-tree-toggler {
        color: #2563EB;
    }
    :host ::ng-deep .p-tree-filter-container { margin-bottom: 1rem; }
    :host ::ng-deep .p-tree-filter-container .p-inputtext {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        background-color: #F9FAFB;
        border: 1px solid #E5E7EB;
    }
    :host ::ng-deep .p-tree-filter-container .p-inputtext:focus {
        background-color: white;
        border-color: #3B82F6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    /* Диалог */
    :host ::ng-deep .p-dialog .p-dialog-header { border-bottom: 1px solid #F3F4F6; padding: 1.5rem; border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
    :host ::ng-deep .p-dialog .p-dialog-content { padding: 1.5rem; }
    :host ::ng-deep .p-dialog .p-dialog-footer { padding: 1rem 1.5rem; border-top: 1px solid #F3F4F6; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; }
    :host ::ng-deep .custom-dialog { border-radius: 1rem; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #E5E7EB; }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);

  categories: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  menuItems: MenuItem[] = [];

  displayDialog = false;
  editMode = false;
  categoryName = '';
  parentNode: TreeNode | null = null;
  editNodeId: number | null = null;

  ngOnInit() {
    this.loadCategories();

    this.menuItems = [
      {
          label: 'Добавить подкатегорию',
          icon: 'pi pi-plus',
          command: () => this.openDialog(this.selectedNode)
      },
      {
          label: 'Редактировать',
          icon: 'pi pi-pencil',
          command: () => this.openEditDialog(this.selectedNode)
      },
      { separator: true },
      {
          label: 'Удалить',
          icon: 'pi pi-trash',
          styleClass: 'text-red-500',
          command: () => this.deleteCategory(this.selectedNode)
      }
    ];
  }

  loadCategories() {
    this.categoryService.getTree().subscribe(data => this.categories = data);
  }

  openDialog(parent: TreeNode | null) {
    this.editMode = false;
    this.parentNode = parent;
    this.categoryName = '';
    this.displayDialog = true;
  }

  openEditDialog(node: TreeNode | null) {
    if (!node) return;
    this.editMode = true;
    this.categoryName = node.label!;
    this.editNodeId = node.data;
    this.parentNode = node.parent || null;
    this.displayDialog = true;
  }

  save() {
    const parentId = this.parentNode ? this.parentNode.data : null;

    if (this.editMode && this.editNodeId) {
      this.categoryService.update(this.editNodeId, this.categoryName, parentId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Обновлено', detail: 'Категория изменена' });
          this.displayDialog = false;
          this.loadCategories();
        }
      });
    } else {
      this.categoryService.create(this.categoryName, parentId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Создано', detail: 'Новая категория добавлена' });
          this.displayDialog = false;
          this.loadCategories();
        }
      });
    }
  }

  deleteCategory(node: TreeNode | null) {
    if (!node) return;

    if (confirm(`Вы уверены, что хотите удалить категорию "${node.label}"? Вложенные категории тоже будут удалены.`)) {
      this.categoryService.delete(node.data).subscribe({
        next: () => {
          this.messageService.add({ severity: 'info', summary: 'Удалено', detail: `Категория "${node.label}" удалена` });
          this.loadCategories();
        }
      });
    }
  }
}
